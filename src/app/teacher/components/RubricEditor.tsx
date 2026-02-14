import { useState, useEffect } from "react";
import { Plus, GripVertical, Trash2, Save, AlertCircle } from "lucide-react";
import type { RubricData, RubricCriterionData } from "../TeacherRubricsPage";

/**
 * RubricEditor - Редактор рубрики
 *
 * Features:
 * - Edit name, description, task type
 * - Add/remove/reorder criteria
 * - Configure scoring scale, weight, required flag
 * - Auto-save with debounce
 */

interface RubricEditorProps {
  rubric: RubricData;
  onSave: (rubric: RubricData) => void;
}

export function RubricEditor({ rubric, onSave }: RubricEditorProps) {
  const [editedRubric, setEditedRubric] = useState<RubricData>(rubric);
  const [isDirty, setIsDirty] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [tagsInput, setTagsInput] = useState("");

  // Update when rubric prop changes - this pattern is intentional for form reset

  useEffect(() => {
    // When rubric prop changes, reset editedRubric state.
    // Use functional updater to avoid reading stale state and schedule asynchronously to avoid cascading renders.
    const t = setTimeout(() => {
      setEditedRubric(rubric);
      setIsDirty(false);
    }, 0);
    return () => clearTimeout(t);
  }, [rubric]);

  const handleSave = () => {
    onSave(editedRubric);
    setIsDirty(false);
  };

  const updateRubric = (updates: Partial<RubricData>) => {
    setEditedRubric({ ...editedRubric, ...updates });
    setIsDirty(true);
  };

  const updateCriterion = (index: number, updates: Partial<RubricCriterionData>) => {
    const newCriteria = [...editedRubric.criteria];
    newCriteria[index] = { ...newCriteria[index], ...updates };
    updateRubric({ criteria: newCriteria });
  };

  const addCriterion = () => {
    const newCriterion: RubricCriterionData = {
      id: `c${Date.now()}`,
      name: "Новый критерий",
      description: "",
      maxScore: 5,
      required: true,
    };
    updateRubric({ criteria: [...editedRubric.criteria, newCriterion] });
  };

  const removeCriterion = (index: number) => {
    if (editedRubric.criteria.length === 1) {
      alert("Нельзя удалить последний критерий");
      return;
    }
    if (confirm("Удалить этот критерий?")) {
      const newCriteria = editedRubric.criteria.filter((_, i) => i !== index);
      updateRubric({ criteria: newCriteria });
    }
  };

  // Drag and drop for reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newCriteria = [...editedRubric.criteria];
    const draggedItem = newCriteria[draggedIndex];
    newCriteria.splice(draggedIndex, 1);
    newCriteria.splice(index, 0, draggedItem);

    setEditedRubric({ ...editedRubric, criteria: newCriteria });
    setDraggedIndex(index);
    setIsDirty(true);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const addTag = () => {
    const tag = tagsInput.trim();
    if (tag && !editedRubric.tags.includes(tag)) {
      updateRubric({ tags: [...editedRubric.tags, tag] });
      setTagsInput("");
    }
  };

  const removeTag = (tag: string) => {
    updateRubric({ tags: editedRubric.tags.filter((t) => t !== tag) });
  };

  return (
    <div className="max-w-[900px] mx-auto">
      {/* Save indicator */}
      {isDirty && (
        <div className="mb-4 flex items-center justify-between bg-[#fff8e1] border border-[#ffe082] rounded-[12px] p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#f57c00]" />
            <span className="text-[14px] text-[#f57c00] font-medium">
              Есть несохранённые изменения
            </span>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors text-[14px] font-medium"
          >
            <Save className="w-4 h-4" />
            Сохранить
          </button>
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-[#f9f9f9] border-2 border-[#e6e8ee] rounded-[16px] p-6 mb-6">
        <h3 className="text-[18px] font-medium text-[#21214f] mb-4 tracking-[-0.5px]">
          Основная информация
        </h3>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[13px] font-medium text-[#21214f] mb-2">
              Название рубрики *
            </label>
            <input
              type="text"
              value={editedRubric.name}
              onChange={(e) => updateRubric({ name: e.target.value })}
              className="w-full px-4 py-2 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] focus:outline-none focus:border-[#5b8def] transition-colors"
              placeholder="Оценка веб-проекта"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[13px] font-medium text-[#21214f] mb-2">Описание</label>
            <textarea
              value={editedRubric.description}
              onChange={(e) => updateRubric({ description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] focus:outline-none focus:border-[#5b8def] transition-colors resize-none"
              placeholder="Критерии оценки для..."
            />
          </div>

          {/* Task Type */}
          <div>
            <label className="block text-[13px] font-medium text-[#21214f] mb-2">
              Тип задания *
            </label>
            <select
              value={editedRubric.taskType}
              onChange={(e) =>
                updateRubric({ taskType: e.target.value as "text" | "code" | "project" })
              }
              className="w-full px-4 py-2 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] focus:outline-none focus:border-[#5b8def] transition-colors bg-white"
            >
              <option value="text">Текст</option>
              <option value="code">Код</option>
              <option value="project">Проект</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[13px] font-medium text-[#21214f] mb-2">Теги</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {editedRubric.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#e9f5ff] text-[#5b8def] rounded-[8px] text-[13px]"
                >
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-[#d4183d]">
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="flex-1 px-3 py-2 border-2 border-[#e6e8ee] rounded-[12px] text-[14px] focus:outline-none focus:border-[#5b8def] transition-colors"
                placeholder="Добавить тег..."
              />
              <button
                onClick={addTag}
                className="px-4 py-2 bg-[#f9f9f9] border-2 border-[#e6e8ee] text-[#21214f] rounded-[12px] hover:bg-[#e6e8ee] transition-colors text-[14px] font-medium"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Criteria */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-medium text-[#21214f] tracking-[-0.5px]">
            Критерии оценивания
          </h3>
          <button
            onClick={addCriterion}
            className="flex items-center gap-2 px-3 py-2 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors text-[14px] font-medium"
          >
            <Plus className="w-4 h-4" />
            Добавить критерий
          </button>
        </div>

        <div className="space-y-4">
          {editedRubric.criteria.map((criterion, index) => (
            <div
              key={criterion.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                bg-white border-2 rounded-[16px] p-4 transition-all
                ${draggedIndex === index ? "opacity-50" : "opacity-100"}
                border-[#e6e8ee] hover:border-[#a0b8f1]
              `}
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <button
                  className="mt-1 cursor-grab active:cursor-grabbing text-[#767692] hover:text-[#21214f]"
                  title="Перетащите для изменения порядка"
                >
                  <GripVertical className="w-5 h-5" />
                </button>

                <div className="flex-1 space-y-3">
                  {/* Name */}
                  <input
                    type="text"
                    value={criterion.name}
                    onChange={(e) => updateCriterion(index, { name: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-[#e6e8ee] rounded-[8px] text-[15px] font-medium focus:outline-none focus:border-[#5b8def] transition-colors"
                    placeholder="Название критерия"
                  />

                  {/* Description */}
                  <textarea
                    value={criterion.description}
                    onChange={(e) => updateCriterion(index, { description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border-2 border-[#e6e8ee] rounded-[8px] text-[14px] focus:outline-none focus:border-[#5b8def] transition-colors resize-none"
                    placeholder="Описание критерия..."
                  />

                  {/* Settings Row */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Max Score */}
                    <div>
                      <label className="block text-[12px] text-[#767692] mb-1">Макс. баллов</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={criterion.maxScore}
                        onChange={(e) =>
                          updateCriterion(index, { maxScore: parseInt(e.target.value) || 5 })
                        }
                        className="w-full px-3 py-2 border-2 border-[#e6e8ee] rounded-[8px] text-[14px] focus:outline-none focus:border-[#5b8def] transition-colors"
                      />
                    </div>

                    {/* Weight */}
                    <div>
                      <label className="block text-[12px] text-[#767692] mb-1">Вес (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={criterion.weight || ""}
                        onChange={(e) =>
                          updateCriterion(index, {
                            weight: e.target.value ? parseInt(e.target.value) : undefined,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-[#e6e8ee] rounded-[8px] text-[14px] focus:outline-none focus:border-[#5b8def] transition-colors"
                        placeholder="Опционально"
                      />
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={criterion.required}
                        onChange={(e) => updateCriterion(index, { required: e.target.checked })}
                        className="w-4 h-4 rounded border-2 border-[#e6e8ee] text-[#5b8def] focus:ring-[#5b8def]"
                      />
                      <span className="text-[13px] text-[#21214f]">Обязательный</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={criterion.commentRequired || false}
                        onChange={(e) =>
                          updateCriterion(index, { commentRequired: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-2 border-[#e6e8ee] text-[#5b8def] focus:ring-[#5b8def]"
                      />
                      <span className="text-[13px] text-[#21214f]">Комментарий обязателен</span>
                    </label>

                    {criterion.commentRequired && (
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-[#767692]">Мин. символов:</span>
                        <input
                          type="number"
                          min="0"
                          value={criterion.minCommentLength || ""}
                          onChange={(e) =>
                            updateCriterion(index, {
                              minCommentLength: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            })
                          }
                          className="w-16 px-2 py-1 border-2 border-[#e6e8ee] rounded-[6px] text-[13px] focus:outline-none focus:border-[#5b8def]"
                          placeholder="20"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => removeCriterion(index)}
                  className="p-2 hover:bg-[#fff5f5] rounded-[8px] transition-colors"
                  title="Удалить критерий"
                >
                  <Trash2 className="w-4 h-4 text-[#d4183d]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className="flex items-center gap-2 px-6 py-3 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors font-medium disabled:bg-[#d7d7d7] disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          Сохранить изменения
        </button>
      </div>
    </div>
  );
}
