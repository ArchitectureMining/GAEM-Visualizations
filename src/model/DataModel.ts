import { ColumnData } from "./ColumnData";

export interface DataModel {
	connect(): void;
	getColumnData(elementType: string, fullname: string, runs: string[]): Promise<ColumnData>;
	// return promise? so we can wait on multiple calls before rendering
	// return [ComponentData[]]? 1 per column?
	disconnect(): void;
}
