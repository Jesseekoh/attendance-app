import QrScanner from 'qr-scanner';
import { useEffect, useRef, useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
const ClassQrScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const qrModalRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    // if (!videoRef.current) return;

    // scannerRef.current = new QrScanner(
    //   videoRef.current,
    //   (result) => {
    //     console.log('Scanned:', result.data);
    //     stopScanner(); // stop after successful scan
    //   },
    //   {
    //     highlightScanRegion: true,
    //   }
    // );

    return () => {
      scannerRef.current?.stop();
      scannerRef.current = null;
    };
  }, []);

  const startScanner = async () => {
    console.log(videoRef);
    if (!videoRef.current) return;

    scannerRef.current = new QrScanner(
      videoRef.current,
      (result) => {
        console.log('Scanned:', result.data);
        stopScanner();
      },
      { highlightScanRegion: true }
    );
    alert('Scanning');
    await scannerRef.current.start();
    setIsScanning(true);
  };

  const stopScanner = async () => {
    // if (scannerRef.current) {
    await scannerRef.current?.stop();
    setIsScanning(false);
    // }
  };
  const openQrModal = () => {
    // setIsScanning(true);
    qrModalRef.current?.showModal();
  };
  return (
    <>
      <button className="btn btn-primary" onClick={openQrModal}>
        Scan qr
      </button>
      <dialog
        id="my_modal_5"
        ref={qrModalRef}
        className="modal modal-bottom sm:modal-middle !transition-transform !duration-300 ease-in-out "
      >
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          {
            <div className="rounded-md overflow-hidden">
              <video ref={videoRef}></video>
            </div>
          }
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click outside to close</p>
          <div className="flex gap-4 mt-4">
            {!isScanning ? (
              <button onClick={startScanner} className="btn btn-primary">
                Start Scan
              </button>
            ) : (
              <button onClick={stopScanner} className="btn btn-error">
                Stop Scan
              </button>
            )}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button
            onClick={() => {
              console.log('hello');
              setIsScanning(false);
            }}
          >
            close
          </button>
        </form>
      </dialog>
    </>
  );
};

export default ClassQrScanner;
