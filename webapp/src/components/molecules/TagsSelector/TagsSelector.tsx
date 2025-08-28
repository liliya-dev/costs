import React, { useEffect, useRef, useState } from 'react';

import Tag from '@/components/atoms/Tag/Tag';
import TextInput from '@/components/atoms/TextInput.tsx/TextInput';
import { ITag } from '@/types';
import { createTag, getTagsForAccount } from '@/utils/api';

import TagsList from './components/TagsList/TagsList';

interface Props {
  accountId: number;
  onChange?: (tags: ITag[]) => void;
  selected?: ITag[];
}

const TagsSelector = ({ accountId, onChange, selected = [] }: Props) => {
  const [search, setSearch] = useState('');
  const [availableTags, setAvailableTags] = useState<ITag[]>([]);
  const [filteredTags, setFilteredTags] = useState<ITag[]>([]);
  const [selectedTags, setSelectedTags] = useState<ITag[]>(selected);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTags = async () => {
      const fetched = await getTagsForAccount(accountId);
      if (fetched.data) {
        setAvailableTags(fetched.data);
        setFilteredTags(fetched.data);
      }
    };
    fetchTags();
  }, [accountId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    const query = value.trim().toLowerCase();

    const filtered = availableTags
      .filter((tag) => tag.name.toLowerCase().includes(query))
      .filter((tag) => !selectedTags.some((t) => t.id === tag.id));

    setFilteredTags(filtered);
    setDropdownOpen(true);
  };

  const handleSelectTag = (tag: ITag) => {
    if (!selectedTags.find((t) => t.id === tag.id)) {
      const updated = [...selectedTags, tag];
      setSelectedTags(updated);
      onChange?.(updated);
    }
    setSearch('');
    setFilteredTags(availableTags);
    setDropdownOpen(false);
  };

  const handleCreateTag = async (name: string) => {
    const res = await createTag({ name, accountId });
    const data = res.data;
    if (data) {
      const updatedAvailable = [...availableTags, data];
      setAvailableTags(updatedAvailable);
      const updatedSelected = [...selectedTags, data];
      setSelectedTags(updatedSelected);
      onChange?.(updatedSelected);
      setSearch('');
      setFilteredTags([]);
      setDropdownOpen(false);
    }
  };

  const removeTag = (id: number) => {
    const updated = selectedTags.filter((tag) => tag.id !== id);
    setSelectedTags(updated);
    onChange?.(updated);
  };

  const trimmedSearch = search.trim().toLowerCase();

  const tagAlreadySelected = selectedTags.some((tag) => tag.name.toLowerCase() === trimmedSearch);

  const tagExists = availableTags.some((tag) => tag.name.toLowerCase() === trimmedSearch);

  return (
    <div className="relative mt-4 space-y-2" ref={containerRef}>
      <label className="mb-1 block text-body-sm font-medium text-dark dark:text-white">
        Select tags
      </label>
      <TextInput
        name="search"
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        onFocus={() => {
          setDropdownOpen(true);
          const unselected = availableTags.filter(
            (tag) => !selectedTags.some((t) => t.id === tag.id),
          );
          setFilteredTags(unselected);
        }}
        placeholder="Search or create tag"
      />

      {dropdownOpen && (
        <div className="absolute left-0 top-[70px] z-10 max-h-[150px] w-full overflow-y-auto rounded border bg-white p-2 shadow-lg">
          <TagsList tags={filteredTags} handleSelectTag={handleSelectTag} />

          {search && tagAlreadySelected && (
            <div className="p-2 text-sm italic text-gray-500">
              Tag with this name is already selected
            </div>
          )}

          {search && !tagExists && !tagAlreadySelected && (
            <div
              className="cursor-pointer p-2 text-blue-500 hover:bg-gray-50"
              onClick={() => handleCreateTag(search)}
            >
              ➕ Create new tag {search}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Tag
            key={tag.id}
            label={tag.name}
            color={tag.color}
            onDismiss={() => removeTag(tag.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TagsSelector;
