import { useAppStore } from "@/core/state/app";
import styles from "./generation.module.css";
import { City } from "@/core/types";
import { InternalHeader } from "../content/header";

interface PrescriptionGenerationProps {
  city?: string;
}

export const GeneratePrescriptions = (props: PrescriptionGenerationProps) => {
  const { generatedPrescriptions, generatePrescription, rejectPrescription, acceptPrescription } = useAppStore();

  return (
    <div className={styles.distribution}>
      <InternalHeader
        title={"Generate prescriptions (" + (props.city ? props.city : "All") + ")"}
        subtitle={"Solve problems or improve your distribution on " + (props.city ? props.city : "All") + ". Use the filters on the map to create clusters and fincrease the precision of the prescriptions."}
        actions={<></>}
      />
      <div className={styles.prompt}>
        <button onClick={() => generatePrescription(props.city as City)}>Generate</button>
      </div>

      <div className={styles.prescriptions}>
        <h4>Generated prescriptions</h4>
        <small>Take action or reject proposals</small>
        <div>
          {generatedPrescriptions
            .filter((pres) => (pres.city === props.city || props.city == undefined) && !pres.rejected && !pres.actionable)
            .map((pres) => {
              return (
                <div>
                  <h6>City - {pres.city ? pres.city : "All"}</h6>
                  <p>{pres.text}</p>
                  <div>
                    <button onClick={() => rejectPrescription(pres.uuid)}>Reject</button>
                    <button onClick={() => acceptPrescription(pres.uuid)}>Take action</button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
