import { toast } from "sonner";

import { extensionRepo } from "@/entities/extension";

type Args = {
  onChanged: () => void;
  teacherId: string;
};

export function useExtensionDecisions({ onChanged, teacherId }: Args) {
  const approve = (id: string) => {
    extensionRepo.approve(id, teacherId);
    onChanged();
    toast.success("Продление одобрено");
  };

  const deny = (id: string) => {
    if (!confirm("Вы уверены, что хотите отклонить запрос на продление?")) return;
    extensionRepo.deny(id, teacherId);
    onChanged();
    toast.info("Запрос отклонён");
  };

  const remove = (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить это продление?")) return;
    extensionRepo.delete(id);
    onChanged();
    toast.success("Продление удалено");
  };

  return { approve, deny, remove };
}
