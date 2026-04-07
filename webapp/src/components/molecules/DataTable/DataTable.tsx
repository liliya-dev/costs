import Link from 'next/link';
import { useMemo, useState } from 'react';

import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import Loader from '@/components/atoms/Loader/Loader';
import Tag from '@/components/atoms/Tag/Tag';
import { ITag } from '@/types';

import TableCell from './components/TableCell';
import TableHeader from './components/TableHeader';
import TableTitle from './components/TableTitle';

export { TableCell };

type SortDirection = 'asc' | 'desc' | null;

export interface ColumnDef<T> {
  key: string;
  title: string;
  sortable?: boolean;
  /** Custom comparator — receives two rows, returns negative/0/positive like Array.sort */
  sortFn?: (a: T, b: T) => number;
  /** How to render the cell content */
  render: (row: T, onTagClick: (tag: ITag) => void) => React.ReactNode;
  /**
   * When getRowHref is provided, columns with linked=false stay outside the <Link>.
   * All other columns are wrapped inside the <Link>. Default: true.
   */
  linked?: boolean;
}

export interface StatusFilterConfig<T> {
  title?: string;
  options: { id: string; label: string }[];
  defaultValue: string;
  filterFn: (row: T, selectedId: string) => boolean;
}

export interface DataTableProps<T> {
  title: string;
  data: T[];
  isLoading: boolean;
  columns: ColumnDef<T>[];
  /** Tailwind grid classes, e.g. "grid-cols-3 sm:grid-cols-6" */
  gridCols: string;
  /** Unique key per row */
  rowKey: (row: T) => string | number;
  /** When provided, linked columns are wrapped in a Next.js Link */
  getRowHref?: (row: T) => string;
  /** Enable tag-chip filter. Rows must have a `tags: ITag[]` field. */
  enableTagFilter?: boolean;
  /** Dropdown-based status filter */
  statusFilter?: StatusFilterConfig<T>;
  /** Show a text search input */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Return a searchable string for a row */
  getSearchableText?: (row: T) => string;
  /** Default sort applied on mount */
  defaultSort?: { key: string; direction: 'asc' | 'desc' };
  /** Rendered to the right of the title */
  titleRight?: React.ReactNode;
  /** Rendered at the bottom of the card */
  footer?: React.ReactNode;
  /** Shown when filtered data is empty */
  emptyState?: React.ReactNode;
}

function DataTable<T>({
  title,
  data,
  isLoading,
  columns,
  gridCols,
  rowKey,
  getRowHref,
  enableTagFilter = false,
  statusFilter,
  searchable = false,
  searchPlaceholder = 'Search...',
  getSearchableText,
  defaultSort,
  titleRight,
  footer,
  emptyState,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(defaultSort?.key ?? null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSort?.direction ?? null);
  const [selectedTags, setSelectedTags] = useState<ITag[]>([]);
  const [statusValue, setStatusValue] = useState(statusFilter?.defaultValue ?? '');
  const [searchText, setSearchText] = useState('');

  const handleColumnClick = (key: string) => {
    if (sortColumn === key) {
      setSortDirection((prev) => (prev === null ? 'asc' : prev === 'asc' ? 'desc' : null));
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  const addTag = (tag: ITag) => {
    setSelectedTags((prev) => (prev.some((t) => t.id === tag.id) ? prev : [...prev, tag]));
  };

  const removeTag = (tag: ITag) => {
    setSelectedTags((prev) => prev.filter((t) => t.id !== tag.id));
  };

  const processedData = useMemo(() => {
    let result = [...data];

    if (statusFilter && statusValue) {
      result = result.filter((row) => statusFilter.filterFn(row, statusValue));
    }

    if (enableTagFilter && selectedTags.length > 0) {
      result = result.filter((row) => {
        const r = row as unknown as { tags: ITag[] };
        return selectedTags.every((st) => r.tags?.some((t) => t.id === st.id));
      });
    }

    if (searchable && searchText && getSearchableText) {
      const lower = searchText.toLowerCase();
      result = result.filter((row) => getSearchableText(row).toLowerCase().includes(lower));
    }

    if (sortColumn && sortDirection) {
      const col = columns.find((c) => c.key === sortColumn);
      if (col?.sortFn) {
        const mul = sortDirection === 'asc' ? 1 : -1;
        result = [...result].sort((a, b) => col.sortFn!(a, b) * mul);
      }
    }

    return result;
  }, [
    data,
    statusFilter,
    statusValue,
    enableTagFilter,
    selectedTags,
    searchable,
    searchText,
    getSearchableText,
    sortColumn,
    sortDirection,
    columns,
  ]);

  const linkedCols = getRowHref ? columns.filter((c) => c.linked !== false) : [];
  const unlinkedCols = getRowHref ? columns.filter((c) => c.linked === false) : columns;

  return (
    <div className="mt-12 rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-4 flex items-start justify-between">
        <TableTitle title={title} />
        {titleRight && <div>{titleRight}</div>}
      </div>

      {statusFilter && (
        <div className="mb-3">
          <Dropdown
            title={statusFilter.title}
            selectedItem={
              statusFilter.options.find((o) => o.id === statusValue) ?? statusFilter.options[0]
            }
            items={statusFilter.options}
            onSelect={(item) => setStatusValue(item.id as string)}
          />
        </div>
      )}

      {searchable && (
        <div className="mb-3">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full rounded border border-gray-300 px-4 py-2 text-base focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
      )}

      {enableTagFilter && (
        <div className="mb-4 min-h-[3rem] p-2">
          {selectedTags.map((tag) => (
            <Tag key={tag.id} label={tag.name} color={tag.color} onDismiss={() => removeTag(tag)} />
          ))}
        </div>
      )}

      <div className="flex flex-col">
        <div className={`grid ${gridCols}`}>
          {columns.map((col) => (
            <TableHeader
              key={col.key}
              title={col.title}
              sortable={col.sortable}
              sortDirection={sortColumn === col.key ? sortDirection : null}
              onClick={col.sortable ? () => handleColumnClick(col.key) : undefined}
            />
          ))}
        </div>

        {isLoading ? (
          <Loader />
        ) : processedData.length === 0 ? (
          (emptyState ?? null)
        ) : (
          processedData.map((row, index) => (
            <div
              key={rowKey(row)}
              className={`grid ${gridCols} ${
                index < processedData.length - 1 ? 'border-b border-stroke dark:border-dark-3' : ''
              }`}
            >
              {getRowHref ? (
                <>
                  <Link href={getRowHref(row)} className="contents">
                    {linkedCols.map((col) => (
                      <TableCell key={col.key}>{col.render(row, addTag)}</TableCell>
                    ))}
                  </Link>
                  {unlinkedCols.map((col) => (
                    <TableCell key={col.key}>{col.render(row, addTag)}</TableCell>
                  ))}
                </>
              ) : (
                columns.map((col) => <TableCell key={col.key}>{col.render(row, addTag)}</TableCell>)
              )}
            </div>
          ))
        )}
      </div>

      {footer && <div className="pt-4">{footer}</div>}
    </div>
  );
}

export default DataTable;
