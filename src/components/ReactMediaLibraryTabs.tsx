import * as React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import FileUpload from "./FileUpload";
import { ReactMediaLibraryTabsProps } from "../types";
import FileLibrary from "./FileLibrary";
import FileLibraryEmpty from "./FileLibraryEmpty";
import FileLibraryLoading from "./FileLibraryIsLoading";

const ReactMediaLibraryTabs: React.FC<ReactMediaLibraryTabsProps> = (props: ReactMediaLibraryTabsProps): JSX.Element => {
	return (
		<Tabs defaultActiveKey={props.defaultActiveKey} id="react-media-library-tabs">

			{ !props.isLoading &&

				<Tab eventKey="library" title={props.libraryTitle}>
					{(Array.isArray(props.fileLibraryList) && props.fileLibraryList.length > 0) &&
					<FileLibrary
							defaultActiveKey={props.defaultActiveKey}
							fileLibraryList={props.fileLibraryList}
							fileSelectCallback={props.fileSelectCallback}
							fileDeleteCallback={props.fileDeleteCallback}
							libraryCardComponent={props.libraryCardComponent}
							deleteButtonLabel={props.deleteButtonLabel}
							selectButtonLabel={props.selectButtonLabel}
						/>
					}

					{
						(Array.isArray(props.fileLibraryList) && props.fileLibraryList.length === 0) &&
						<FileLibraryEmpty
							emptyMessage={props.emptyMessage}
						/>
					}
				</Tab>

			}

			{ props.isLoading &&
				<Tab eventKey="library" title={props.loadingMessage}>
					<FileLibraryLoading
						loadingMessage={props.loadingMessage}
					/>
				</Tab>
			}

			<Tab eventKey="upload" title={props.uploadTitle}>
				<div className="pt-3">
					<FileUpload
						fileUploadCallback={props.fileUploadCallback}
						onAfterUploadFiles={props.onAfterUploadFiles}
					/>
				</div>
			</Tab>

		</Tabs>
	);
};

export default ReactMediaLibraryTabs;


