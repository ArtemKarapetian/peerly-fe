import { toast } from "sonner";

import { extensionRepo } from "@/entities/extension";

type Args = {
  onChanged: () => void;
  teacherId: string;
};

export function useExtensionDecisions({ onChanged, teacherId }: Args) {
  const approve = async (id: string) => {
    await extensionRepo.approve(id, teacherId);
    onChanged();
    toast.success("Продление одобрено");
  };

  const deny = async (id: string) => {
    if (!confirm("Вы уверены, что хотите отклонить запрос на продление?")) return;
    await extensionRepo.deny(id, teacherId);
    onChanged();
    toast.info("Запрос отклонён");
  };

  const remove = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить это продление?")) return;
    await extensionRepo.delete(id);
    onChanged();
    toast.success("Продление удалено");
  };

  return { approve, deny, remove };
}
