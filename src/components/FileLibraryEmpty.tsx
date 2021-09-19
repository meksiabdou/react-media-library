import React from "react";
import {FileLibraryProps} from "../types";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const FileLibraryEmpty: React.FC<FileLibraryProps> = (props: FileLibraryProps): JSX.Element => {

	return (
		<React.Fragment>
			<Row className="py-3">
			<Col  xs={12} sm={6} md={4} lg={3} className="mb-3">
						{props.emptyMessage}
					</Col>
			</Row>
		</React.Fragment>
	);
};

export default FileLibraryEmpty;