"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Header, InternalHeader } from "../organisms/content/header";
import styles from "./manager.module.css";
import { faMapLocationDot, faTrash, faUsers } from "@fortawesome/free-solid-svg-icons";
import { faChartBar, faEdit } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";

import DataTable from "react-data-table-component";
import { PrescriptionManagement } from "@/core/types";
import { useAppStore } from "@/core/state/app";
import { useState } from "react";
import { LinearProgress } from "@mui/material";
import { GeneratePrescriptions } from "../organisms/prescriptions/generation";

const ExpandedComponent = ({ data }: { data: PrescriptionManagement }) => {
  const [loadedData, setLoadedData] = useState<PrescriptionManagement>(data);

  const { configPrescription } = useAppStore();

  return (
    <div className={styles.expandableRow}>
      <p>Prescription: {data.prescription}</p>
      <p>City: {data.city}</p>
      <p>Start date: {new Date(data.startDate).toDateString()}</p>

      <div>
        <h4>Config</h4>
        <div>
          <div>
            <label htmlFor="">Executed outcome</label>
            <input value={loadedData.executedOutcome} onChange={(e) => setLoadedData({ ...loadedData, executedOutcome: Number(e.target.value) })} type="number" />
          </div>
          <div>
            <label htmlFor="">Owner</label>
            <input value={loadedData.owner} onChange={(e) => setLoadedData({ ...loadedData, owner: e.target.value })} type="text" />
          </div>
          <div>
            <label htmlFor="">Impact status</label>
            <input value={loadedData.impactStatus} onChange={(e) => setLoadedData({ ...loadedData, impactStatus: Number(e.target.value) })} type="number" />
          </div>
          <div>
            <label htmlFor="">Deployment Rate</label>
            <input value={loadedData.deploymentRate} onChange={(e) => setLoadedData({ ...loadedData, deploymentRate: Number(e.target.value) })} type="number" />
          </div>
        </div>
        <button onClick={() => configPrescription(loadedData.uuid, loadedData)}>Save</button>
      </div>
    </div>
  );
};

export const ManagerPageComponent = () => {
  const { exectionPrescriptions, deletePrescription } = useAppStore();

  const columns = [
    {
      name: "Prescription",
      selector: (row: PrescriptionManagement) => row.prescription,
    },
    {
      name: "Mexico",
      selector: (row: PrescriptionManagement) => row.city,
      sortable: true,
    },
    {
      name: "Executed outcome",
      selector: (row: PrescriptionManagement) => row.executedOutcome,
      sortable: true,
    },
    {
      name: "Start date",
      selector: (row: PrescriptionManagement) => new Date(row.startDate).toDateString(),
      sortable: true,
    },
    {
      name: "Ends date",
      selector: (row: PrescriptionManagement) => new Date(row.endsDate).toDateString(),
      sortable: true,
    },
    {
      name: "Owner",
      selector: (row: PrescriptionManagement) => row.owner,
    },
    {
      name: "Impact status",
      selector: (row: PrescriptionManagement) => (
        <div style={{ display: "block", width: 200 }}>
          <LinearProgress variant="determinate" value={row.impactStatus} />
        </div>
      ),
      sortable: true,
    },
    {
      name: "Deployment Rate",
      selector: (row: PrescriptionManagement) => (
        <div style={{ display: "block", width: 200 }}>
          <LinearProgress variant="determinate" value={row.deploymentRate} />
        </div>
      ),
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row: PrescriptionManagement) => (
        <>
          <FontAwesomeIcon className={styles.prescriptionAction} icon={faTrash} onClick={() => deletePrescription(row.uuid)} />
          {/* <FontAwesomeIcon className={styles.prescriptionAction} icon={faEdit} onClick={() => console.log(row)} /> */}
        </>
      ),
    },
  ];

  return (
    <div className={styles.managerPage}>
      <Header
        title="Manager"
        subtitle="Harmony - Global Actionable Knowledge"
        actions={
          <>
            <Link href={"/dashboard"}>
              <FontAwesomeIcon icon={faMapLocationDot} />
            </Link>
            <Link href={"/manager"}>
              <FontAwesomeIcon icon={faChartBar} />
            </Link>
          </>
        }
      />

      {exectionPrescriptions ? (
        <div className={styles.board}>
          <InternalHeader title="Manage events" subtitle="Events by role" actions={<></>} />
          <DataTable expandableRows columns={columns as any} data={exectionPrescriptions as any} expandableRowsComponent={ExpandedComponent} />
        </div>
      ) : (
        ""
      )}

      <GeneratePrescriptions />
    </div>
  );
};
