interface IOption {
  value: string;
  label: string;
  children?: IOption[] | null | [] | undefined;
  parent_id?: string | null | undefined;
  ordinary?: string | null | undefined;
  is_user?: string | number | null | undefined;
  is_legal?: number | null | undefined;
  is_disabled?: number | boolean | null | undefined;
}
export { IOption };
