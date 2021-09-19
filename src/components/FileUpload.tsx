import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUploadProps } from "../types";
import { FileData, FileUploadListItem } from "../types/components/FileUpload";
import FileUploadList from "./FileUploadList";
import Swal from "../utils/Swal";


const FileUpload: React.FC<FileUploadProps> = (props: FileUploadProps): JSX.Element => {
	const [fileUploadList, setFileUploadList] = useState<FileUploadListItem[]>([]);

	const onAfterUploadFiles = props.onAfterUploadFiles ? props.onAfterUploadFiles : () => null;

	const toBase64 = (file: File): Promise<String | null | ArrayBuffer> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error.toString());
		});
	};

	const imageTitle = (): Promise<any> => {
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: "btn btn-danger",
				cancelButton: "btn btn-secondary",
			},
			buttonsStyling: false,
		});
		return new Promise((resolve, reject) => {
			swalWithBootstrapButtons.fire({
				title: "Submit Image Title",
				input: "text",
				inputAttributes: {
					autocapitalize: "off",
				},
				showCancelButton: true,
				confirmButtonText: "Submit",
				showLoaderOnConfirm: true,
				preConfirm: (title: String | Number) => {
					if (title) {
						resolve(title);
					} else {
						reject(null);
					}
				},
				allowOutsideClick: false,
				backdrop: true,
			});
		});
	};

	async function onDrop(acceptedFiles: File[]) {
		let newFileUploadList: FileUploadListItem[] = acceptedFiles.map((element: File) => {
			return { fileName: element.name, status: 0 };
		}).concat(fileUploadList);

		const files: Array<FileData> = [];
		const title = await imageTitle().catch((e) => e);

		await Promise.all(
			acceptedFiles.map(async (file, index) => {
				const fileMeta = {
					fileName: file.name,
					type: file.type,
					size: file.size,
				};
				const fileBase64 = await toBase64(file).catch((e) => {
					console.log(e.toString());
					return null;
				});
				const result = await props.fileUploadCallback({
					file,
					fileMeta,
					fileBase64,
					title,
				});
				//newFileUploadList = [...newFileUploadList];
				newFileUploadList[index].status = result?.status ? 1 : -1;
				files.push({
					type: file.type,
					size: file.size,
					title,
					fileName: result?.fileName || file.name,
					status: newFileUploadList[index].status === 1,
				});
			})
		);

		setFileUploadList(newFileUploadList);
		onAfterUploadFiles(files);
	}
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
	return (
		<React.Fragment>
			<div
				className={`p-5 text-center alert alert-${isDragActive ? "success" : "secondary"}`}
				{...getRootProps()}
			>
				<input {...getInputProps()} />
				{isDragActive ?
					<p className="m-0">Drop the files here ...</p> :
					<p className="m-0">Drag 'n' drop some files here, or click to select files</p>
				}
			</div>
			<FileUploadList fileUploadList={fileUploadList} />
		</React.Fragment>
	)
};

export default FileUpload;