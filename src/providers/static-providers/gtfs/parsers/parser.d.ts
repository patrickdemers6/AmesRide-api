export interface Parser<T_in, T_out> {
  parseRow(data: T_in): T_out;
}
