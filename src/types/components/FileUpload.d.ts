export interface FileMeta {
	fileName: string;
	type: string;
	size: number;
}

interface FileUploadResult {
	status?: boolean;
	fileName?: string;
};

export interface FileData {
	fileName: string | undefined;
	type: string;
	size: number;
	title: string | any;
	status: boolean;
};

export interface FileDataResult {
	file: file;
	fileMeta: FileMeta;
	fileBase64: String | null | ArrayBuffer;
	title: string | any;
}

export interface FileUploadProps {
	fileUploadCallback: (data: FileDataResult) => Promise<FileUploadResult>;
	onAfterUploadFiles?: (data: Array<FileData>) => void;
}

export interface FileUploadListItem {
	fileName: string;
	status: number;
}