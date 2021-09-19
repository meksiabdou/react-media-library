import React, { ReactNode, useState, useEffect } from "react";
import { FileLibraryListItem, FileLibraryProps } from "../types";
import Col from "react-bootstrap/Col";
import FileLibraryCard from "./FileLibraryCard";
import Row from "react-bootstrap/Row";
///import Button from "react-bootstrap/Button";
import FileLibraryPager from "./FileLibraryPager";
import { Form, FormControl, InputGroup } from "react-bootstrap";
import Swal from "../utils/Swal";

interface FileLibraryCardComponent extends FileLibraryListItem {
	selectedItem: FileLibraryListItem | undefined;
	deleteButtonLabel?: string;
	selectButtonLabel?: string;
	[key: string]: any;
	fileSelectCallback: (item: FileLibraryListItem) => void;
	fileDeleteCallback: (item: FileLibraryListItem) => void;
}

const FileLibrary: React.FC<FileLibraryProps> = (
	props: FileLibraryProps
): JSX.Element => {
	const [selectedItem, setSelectedItem] = useState<
		FileLibraryListItem | undefined
	>(undefined);
	const [page, setPage] = useState<number>(1);
	const [searchValue, setSearchValue] = useState<any>("");
	const [fileLibraryListData, setFileLibraryListData] = useState<
		Array<FileLibraryListItem>
	>([]);

	const itemsPerPage = 12;

	const fileDeleteCallback = props.fileDeleteCallback ? props.fileDeleteCallback : (item : FileLibraryListItem) => item;
	const fileSelectCallback = props.fileSelectCallback ? props.fileSelectCallback : (item : FileLibraryListItem) => item;

	useEffect(() => {
		setFileLibraryListData(props.fileLibraryList || []);
	}, [props.fileLibraryList]);

	const deleteFile = (element: FileLibraryListItem) => {
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: "btn btn-danger",
				cancelButton: "btn btn-secondary",
			},
			buttonsStyling: false,
		});
		swalWithBootstrapButtons.fire({
			title: "Are you sure you want to delete permanently?",
			confirmButtonText: "Delete",
			showCancelButton: true,
			cancelButtonText: "Cancel",
			text: "",
			showLoaderOnConfirm: true,
			icon: "warning",
			preConfirm: () => fileDeleteCallback(element),
		});
	};

	function sortArray(
		a: FileLibraryListItem,
		b: FileLibraryListItem
	): -1 | 0 | 1 {
		try {
			const property = props.sortProperty;
			let valA: any = property !== undefined ? a[property] : 0;
			let valB: any = property !== undefined ? b[property] : 0;

			// If string, ignore upper and lowercase
			if (typeof valA === "string") valA = valA.toUpperCase();
			if (typeof valB === "string") valB = valB.toUpperCase();

			if (props.sortAscending) {
				return valA < valB ? -1 : 1;
			} else {
				return valA > valB ? -1 : 1;
			}
		} catch {
			return 0;
		}
	}

	const escapeRegExp = (string: String): String | null => {
		if (string) {
			// eslint-disable-next-line no-useless-escape
			return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		}
		return null;
	};

	const onSearch = (event: any) => {
		event.preventDefault();
		if (searchValue) {
			const regExp = new RegExp(`${escapeRegExp(searchValue.toLocaleLowerCase())}`, "g");
			const data = (props.fileLibraryList || []).filter((item) => {
				const title = item?.title?.toLowerCase();
				if (title && searchValue) {
					return Array.isArray(title.toLocaleLowerCase().match(regExp));
				}
				return false;
			});
			setFileLibraryListData(data);
		} else {
			setFileLibraryListData(props.fileLibraryList || []);
		}
	};

	function renderList(): ReactNode[] {
		if (!props.fileLibraryList) return [];

		const arrayStart = (page - 1) * itemsPerPage;
		let arrayEnd = arrayStart + itemsPerPage;
		if (arrayEnd > fileLibraryListData.length) {
			// If calculated end extends past length of actual array
			// Set calculated end as length of array
			arrayEnd = fileLibraryListData.length;
		}

		return fileLibraryListData
			.sort(sortArray)
			.slice(arrayStart, arrayEnd)
			.map((element: FileLibraryListItem, index: number) => {
				return (
					<Col
						key={index}
						xs={12}
						sm={6}
						md={4}
						lg={3}
						className="mb-3"
						onClick={() => setSelectedItem(element)}
					>
						{React.createElement(
							props.libraryCardComponent as React.FC<FileLibraryCardComponent>,
							{
								selectedItem,
								...element,
								fileDeleteCallback: deleteFile,
								fileSelectCallback: fileSelectCallback,
								deleteButtonLabel: props.deleteButtonLabel,
								selectButtonLabel: props.selectButtonLabel,
							}
						)}
					</Col>
				);
			});
	}

	const pagerRow: ReactNode = fileLibraryListData &&
		fileLibraryListData.length > itemsPerPage && (
			<Row>
				<Col className="d-flex justify-content-center">
					<FileLibraryPager
						count={fileLibraryListData.length}
						page={page}
						pagerCallback={(number: number) => setPage(number)}
						itemsPerPage={itemsPerPage}
					/>
				</Col>
			</Row>
		);

	return (
		<React.Fragment>
			<Row className="mt-2">
				<Col>
					<Form onSubmit={onSearch}>
						<InputGroup>
							<FormControl
								type="text"
								placeholder={"Search"}
								name="search"
								value={searchValue}
								dir={"auto"}
								spellCheck
								onChange={(event) => setSearchValue(event.target.value)}
							/>
							<InputGroup.Prepend className="p-0">
								<button
									type="button"
									className="btn-close me-2 ms-2"
									onClick={() => {
										setSearchValue("");
										setFileLibraryListData(props.fileLibraryList || []);
									}}
								></button>
							</InputGroup.Prepend>
						</InputGroup>
					</Form>
				</Col>
			</Row>
			<Row className="py-3">{renderList()}</Row>
			{pagerRow}
			{/*submitRow*/}
		</React.Fragment>
	);
};

FileLibrary.defaultProps = {
	sortProperty: "createdAt",
	sortAscending: false,
	libraryCardComponent: FileLibraryCard,
	//fileDeleteCallback : () => null,
	//fileSelectCallback : () => null,
};

export default FileLibrary;
