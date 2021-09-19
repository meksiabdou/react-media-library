import { useState } from 'react';
import { FileData, FileDataResult, FileLibraryListItem, ReactMediaLibrary } from "react-media-library";
import images from "./data";


function App() {

  const [mediaLibShow, setMediaLibShow] = useState<boolean>(false);
  const [fileLibraryList, setFileLibraryList] = useState<Array<FileLibraryListItem>>(images);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const uploadCallback = async (file: FileDataResult) => {
    const { fileMeta, fileBase64, title } = file;
    console.log(fileMeta, title);
    if (fileBase64) {
      return {
        status: true,
      }
    }
    setIsLoading(false);
    return {
      status: false,
    };
  };

  const selectCallback = (item: FileLibraryListItem) => {
    console.log(item);
  };

  const deleteCallback = async (item: FileLibraryListItem) => {
    // TODO Delete file from backend service
    console.log(item);
    const status = true;

    if (status) {
      const data = fileLibraryList.filter(
        (_item: FileLibraryListItem) => _item?.fileName !== item?.fileName
      );
      //console.log(data);
      setFileLibraryList(data);
    } else {
    }
  };

  return (
    <div className="App">
      <button className='btn btn-danger' onClick={() => setMediaLibShow(true)}>Open Library</button>
      <ReactMediaLibrary
        show={mediaLibShow}
        fileLibraryList={fileLibraryList}
        isLoading={isLoading}
        defaultActiveKey={"library"}
        onHide={() => setMediaLibShow(false)}
        fileUploadCallback={uploadCallback}
        fileSelectCallback={selectCallback}
        fileDeleteCallback={deleteCallback}
        onAfterUploadFiles={(files: Array<FileData>) => {
          console.log(files);
          const data = [
            ...files.filter((item: any) => {
              if (item.status) {
                item.thumbnailUrl = `https://phones-next.herokuapp.com/images/${item.fileName}`;
                return true;
              }
              return false;
            }),
            ...fileLibraryList,
          ];
          setFileLibraryList(data as Array<FileLibraryListItem>);
        }}
      />
    </div>
  );
}

export default App;
