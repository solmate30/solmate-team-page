"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, Upload, GripVertical } from "lucide-react";
import { createCrewMember, updateCrewMember, deleteCrewMember, getCloudinarySignature } from "./actions";
import { toast } from "sonner";

type Crew = {
  id: string;
  nickname: string;
  name: string;
  career1: string;
  career2: string;
  photoUrl: string;
  sortOrder: number;
};

type FormState = {
  nickname: string;
  name: string;
  career1: string;
  career2: string;
  photoUrl: string;
  sortOrder: number;
};

const EMPTY_FORM: FormState = {
  nickname: "",
  name: "",
  career1: "",
  career2: "",
  photoUrl: "",
  sortOrder: 0,
};


function PhotoPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      // 서버에서 서명만 받고, 클라이언트가 Cloudinary에 직접 업로드
      const { signature, timestamp, apiKey, cloudName, folder } =
        await getCloudinarySignature();

      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", apiKey);
      fd.append("timestamp", String(timestamp));
      fd.append("signature", signature);
      fd.append("folder", folder);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: fd }
      );
      if (!res.ok) throw new Error(`업로드 실패 (${res.status})`);
      const json = await res.json();
      onChange(json.secure_url as string);
      toast.success("사진 업로드 완료");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "업로드 실패");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
        {value ? (
          <img src={value} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Upload className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="text-xs"
        >
          {uploading ? "업로드 중..." : "사진 선택"}
        </Button>
        {value && (
          <p className="text-[10px] text-slate-400 mt-1 truncate max-w-[180px]">{value}</p>
        )}
      </div>
    </div>
  );
}

function MemberForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: {
  initial: FormState;
  onSubmit: (data: FormState) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<FormState>(initial);

  function field(key: keyof FormState) {
    return {
      value: String(form[key]),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [key]: key === "sortOrder" ? Number(e.target.value) : e.target.value })),
    };
  }

  return (
    <div className="space-y-4">
      <PhotoPicker
        value={form.photoUrl}
        onChange={(url) => setForm((f) => ({ ...f, photoUrl: url }))}
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">닉네임</label>
          <Input placeholder="Azer" {...field("nickname")} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">이름</label>
          <Input placeholder="Nam Hyeongseog" {...field("name")} />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-600">이력 1</label>
        <Input placeholder="AI / Tech Lead" {...field("career1")} />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-600">이력 2</label>
        <Input placeholder="Full-stack Developer" {...field("career2")} />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-600">정렬 순서</label>
        <Input type="number" placeholder="0" {...field("sortOrder")} className="w-24" />
      </div>
      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          disabled={loading}
          onClick={() => onSubmit(form)}
          className="bg-[#1152d4] hover:bg-blue-700"
        >
          {loading ? "저장 중..." : "저장"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
      </div>
    </div>
  );
}

export function CrewAdmin({ initial }: { initial: Crew[] }) {
  const [members, setMembers] = useState<Crew[]>(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Crew | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreate(data: FormState) {
    setLoading(true);
    try {
      await createCrewMember(data);
      setMembers((prev) => [
        ...prev,
        { id: "new-" + Date.now(), ...data },
      ]);
      setShowAdd(false);
      toast.success("멤버가 추가됐습니다.");
    } catch {
      toast.error("추가 실패");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(data: FormState) {
    if (!editTarget) return;
    setLoading(true);
    try {
      await updateCrewMember(editTarget.id, data);
      setMembers((prev) =>
        prev.map((m) => (m.id === editTarget.id ? { ...m, ...data } : m))
      );
      setEditTarget(null);
      toast.success("수정됐습니다.");
    } catch {
      toast.error("수정 실패");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" 멤버를 삭제할까요?`)) return;
    try {
      await deleteCrewMember(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      toast.success("삭제됐습니다.");
    } catch {
      toast.error("삭제 실패");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[#1152d4] uppercase tracking-widest mb-0.5">Solmate Admin</p>
          <h1 className="text-xl font-bold text-slate-900">Crew 관리</h1>
        </div>
        <Button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[#1152d4] hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          새 멤버 추가
        </Button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {members.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <p className="text-lg font-medium mb-2">등록된 멤버가 없습니다</p>
            <p className="text-sm">"새 멤버 추가" 버튼으로 첫 번째 멤버를 등록하세요.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...members]
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl border border-slate-100 px-5 py-4 flex items-center gap-4 shadow-sm"
                >
                  <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                    {m.photoUrl ? (
                      <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-lg font-bold">
                        {m.nickname.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#1152d4] uppercase tracking-widest">
                        {m.nickname}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-sm font-semibold text-slate-800">{m.name}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {m.career1} · {m.career2}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditTarget(m)}
                      className="h-8 px-3"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(m.id, m.name)}
                      className="h-8 px-3 text-red-500 hover:text-red-600 hover:border-red-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>

      {/* 추가 Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>새 멤버 추가</DialogTitle>
          </DialogHeader>
          <MemberForm
            initial={{ ...EMPTY_FORM, sortOrder: members.length }}
            onSubmit={handleCreate}
            onCancel={() => setShowAdd(false)}
            loading={loading}
          />
        </DialogContent>
      </Dialog>

      {/* 수정 Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>멤버 수정</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <MemberForm
              initial={{
                nickname: editTarget.nickname,
                name: editTarget.name,
                career1: editTarget.career1,
                career2: editTarget.career2,
                photoUrl: editTarget.photoUrl,
                sortOrder: editTarget.sortOrder,
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditTarget(null)}
              loading={loading}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
