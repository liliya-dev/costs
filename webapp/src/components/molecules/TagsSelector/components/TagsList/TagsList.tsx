import { ITag } from '@/types';

interface IProps {
  tags: ITag[];
  handleSelectTag: (tag: ITag) => void;
}

const TagsList = ({ tags, handleSelectTag }: IProps) => {
  return (
    <>
      {tags.map((tag) => (
        <div
          key={tag.id}
          onClick={() => handleSelectTag(tag)}
          className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-100"
        >
          <span
            className="inline-block h-4 w-4 rounded-full"
            style={{ backgroundColor: tag.color }}
          ></span>
          <span className="text-sm text-gray-700">{tag.name}</span>
        </div>
      ))}
    </>
  );
};

export default TagsList;
