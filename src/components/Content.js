import { useState, useEffect } from "react";
import { BsFillPrinterFill } from "react-icons/bs";
import dataProp from './data2';


const downloadImage = (base64Url, filename) => {
    // Create an anchor element (<a>) for the download
    const link = document.createElement("a");
    link.href = base64Url;

    // Set the download attribute to the desired file name with .jpg extension
    link.download = filename + ".jpg";

    // Append the link to the body, click it, and then remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
export default function Content() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const imgOrigin = localStorage.getItem('image1_base64');
            const imgPrint = localStorage.getItem('image2_base64');
            if (imgOrigin && imgPrint) {
                setData([{
                    "img1": imgOrigin,
                    "img2": imgPrint
                }]);
            }
        }, 1000); // checks every 1 second
    
        return () => clearInterval(interval);
    }, []);
    
    const loadData = async () => {
        try {
            const response = await fetch('/api/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            if (response.ok) {
                setData(data);
            } else {
                setData(null)
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    
    



    return (
            <div className={`content show`}>
                {data.length > 0 ? (
                    <>
                        {data.map((item, index) => (
                            <div key={index}>
                                <div className="h-row">
                                    <h1>{item.title}</h1>
                                    <button onClick={() => downloadImage(`data:image/jpeg;base64,${item.img2}`, `Image_${index}`)}>
                                        <BsFillPrinterFill /> Print
                                    </button>
                                </div>
                                <div className="img-processed">
                                    <div className="row img"><img src={`data:image/jpeg;base64,${item.img1}`} alt={item.title} /></div>
                                    <div className="row img-grid"><img src={`data:image/jpeg;base64,${item.img2}`} alt={item.title} /></div>
                                </div>
                            </div>
                        ))}
                    </>
                ) :
                    (
                        <>
                            <p className="loading">loading...</p>
                        </>
                    )}
            </div>
        );
    }