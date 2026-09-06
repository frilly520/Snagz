import React, { useState } from 'react';
import { X, Bookmark, Plus, Check } from 'lucide-react';
import { Deal, UserList } from '../types';

interface AddToListModalProps {
  deal: Deal | null;
  userLists: UserList[];
  onClose: () => void;
  onAddToList: (listId: string, dealId: string, note?: string) => void;
  onCreateAndAdd: (listName: string, dealId: string, note?: string) => void;
}

export const AddToListModal: React.FC<AddToListModalProps> = ({
  deal,
  userLists,
  onClose,
  onAddToList,
  onCreateAndAdd
}) => {
  const [selectedListId, setSelectedListId] = useState<string>(userLists[0]?.id || '');
  const [note, setNote] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(userLists.length === 0);
  const [newListName, setNewListName] = useState('');
  const [success, setSuccess] = useState(false);

  if (!deal) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreatingNew) {
      if (!newListName.trim()) return;
      onCreateAndAdd(newListName, deal.id, note);
    } else {
      if (!selectedListId) return;
      onAddToList(selectedListId, deal.id, note);
    }
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div 
      id="add-to-list-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        id="add-to-list-modal"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add Deal to Custom List</h3>
              <p className="text-xs text-neutral-400 line-clamp-1">{deal.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center text-xs text-emerald-400 space-y-2">
            <Check className="w-10 h-10 mx-auto text-emerald-400 animate-bounce" />
            <span className="font-bold text-sm block">Added to your list!</span>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            {!isCreatingNew && userLists.length > 0 ? (
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Choose List</label>
                <select
                  value={selectedListId}
                  onChange={(e) => setSelectedListId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                >
                  {userLists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name} ({list.dealIds.length} items)
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(true)}
                  className="mt-2 text-emerald-400 hover:underline inline-flex items-center gap-1 text-[11px]"
                >
                  <Plus className="w-3 h-3" />
                  <span>Or create a new list...</span>
                </button>
              </div>
            ) : (
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">New List Name</label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g. Black Friday Wishlist"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
                {userLists.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsCreatingNew(false)}
                    className="mt-2 text-neutral-400 hover:underline block text-[11px]"
                  >
                    Select an existing list instead
                  </button>
                )}
              </div>
            )}

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Personal Shopping Note (Optional)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Remember to apply 6% Rakuten cashback at checkout"
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold"
              >
                Save to List
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
