import React from "react";
import { FileLibraryListItem } from "../types";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import formatBytes from "../utils/formatBytes";
import formatDate from "../utils/formatDate";
import Button  from "react-bootstrap/Button";

const imgStyle: React.CSSProperties = {
	width: "100%",
	height: "150px",
	objectFit: "cover",
	objectPosition: "50% 50%",
};

interface IProps extends FileLibraryListItem {
	selectedItem: FileLibraryListItem | undefined;
	deleteButtonLabel?: string;
	selectButtonLabel?: string;
	fileSelectCallback: (item: FileLibraryListItem) => void;
	fileDeleteCallback: (item: FileLibraryListItem) => void;
}

const FileLibraryCard: React.FC<IProps> = (props: IProps): JSX.Element => {

	const focus =
		props.selectedItem !== undefined && props.selectedItem.fileName === props.fileName;
	const element = {
		_id: props._id,
		title: props.title,
		description: props.description,
		fileName: props.fileName,
		size: props.size,
		createdAt: props.createdAt,
		thumbnailUrl: props.thumbnailUrl,
	};

	return (
		<Card
			className={(props.selectedItem !== undefined && props.selectedItem._id === props._id) ? "focus" : undefined}
		>
			{(props.thumbnailUrl) && (
				<Card.Img variant="top" src={props.thumbnailUrl} style={imgStyle} />
			)}
			{(props.title || props.description) && (
				<Card.Body>
					<Card.Title>{props.title}</Card.Title>
					<Card.Text>{props.description}</Card.Text>
				</Card.Body>
			)}
			<ListGroup className="list-group-flush small">
				{(props.fileName) && (<ListGroupItem>{props.fileName}</ListGroupItem>)}
				{(props.size !== undefined) && (<ListGroupItem>{formatBytes(props.size)}</ListGroupItem>)}
				{(props.createdAt) && (<ListGroupItem>{formatDate(props.createdAt)}</ListGroupItem>)}
			</ListGroup>
			<div className={`detail ${focus ? "focus" : ""}`}>
				<Button variant="primary" onClick={() => props.fileSelectCallback(element as FileLibraryListItem)}>
					{props.selectButtonLabel}
				</Button>
				<Button variant="danger" onClick={() => props.fileDeleteCallback(element as FileLibraryListItem)}>
					{props.deleteButtonLabel}
				</Button>
			</div>
		</Card>
	);
};

export default FileLibraryCard;