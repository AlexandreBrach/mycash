import './PageConfiguration.scss';
import { FC, useEffect, useState } from 'react';
import Layout from '../Layout';
import Montant from '../Components/Montant';
import factory from '../services/Factory';
import ReactModal from 'react-modal';

const PageConfiguration: FC = () => {
  const sendNewSolde = async () => {
    await backendStateService.setSolde(newSolde);
    setModalSoldeIsOpen(false);
  };
  const openSoldePopup = () => {
    setModalSoldeIsOpen(true);
  };
  const [solde, setSolde] = useState<number>(0);
  const [newSolde, setNewSolde] = useState<number>(0);
  const [modalSoldeIsOpen, setModalSoldeIsOpen] = useState<boolean>(false);

  const backendStateService = factory.getBackendStateService();

  useEffect(() => {
    const run = async () => {
      const s = await backendStateService.retrieveSolde();
      setSolde(s);
    };
    void run();
  }, []);

  const content = (
    <div id="page-configuration">
      <table>
        <tbody>
          <tr>
            <td>Solde actuel du compte :</td>
            <td>
              <span className={solde < 0 ? 'alert' : 'ok'}>
                <Montant value={solde} />
              </span>
            </td>
            <td>
              <button onClick={openSoldePopup}>Réévaluer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
  return (
    <>
      <ReactModal
        isOpen={modalSoldeIsOpen}
        onRequestClose={() => {
          setModalSoldeIsOpen(false);
        }}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        className="modal"
      >
        <h1>Forcer la valeur du solde</h1>
        Nouveau solde :
        <input type="number" value={newSolde} onChange={(e) => setNewSolde(parseFloat(e.target.value))}></input>
        <div className="buttons">
          <button onClick={() => sendNewSolde()}>Ok</button>
          &nbsp;
          <button onClick={() => setModalSoldeIsOpen(false)}>Cancel</button>
        </div>
      </ReactModal>
      <Layout content={content} />
    </>
  );
};

export default PageConfiguration;
