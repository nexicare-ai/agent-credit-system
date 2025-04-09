// Column definitions for CMS Users table
export const CMS_USER_COLUMNS = [
  {
    id: 'mobile',
    label: 'Mobile Number',
    minWidth: 150,
  },
  {
    id: 'email',
    label: 'Email',
    minWidth: 200,
  },
  {
    id: 'name',
    label: 'Name',
    minWidth: 170,
  },
  {
    id: 'created_at',
    label: 'Created At',
    minWidth: 170,
    format: (value) => new Date(value).toLocaleString(),
  },
  {
    id: 'updated_at',
    label: 'Updated At',
    minWidth: 170,
    format: (value) => new Date(value).toLocaleString(),
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 120,
    align: 'center',
  },
];

// Default pagination options
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];
