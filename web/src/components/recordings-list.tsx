import { useEffect, useState } from "react"
import useRecordingsList from "../hooks/use-recordings-list"
import { RecordingsListProps } from "../types/recorder"
import "./styles.css"
import { WaveForm } from "./wave-form"
import { Audio } from "../types/recorder"

export default function RecordingsList({ audio }: RecordingsListProps) {
  const { recordings, deleteAudio } = useRecordingsList(audio)

  console.log(recordings)

  return (
    <div>
      <div>
        {recordings.map(recoding => {
          return (
            <div key={recoding.key} className="mb-3">
              <WaveForm fileUrl={recoding.audio} />
            </div>
          )
        })}
      </div>
      {/* <div className="recordings-container mt-96">
        {recordings.length > 0 ? (
          <>
            <h1>Your recordings</h1>
            <div className="recordings-list">
              {recordings.map(record => (
                <div className="record" key={record.key}>
                  <audio controls src={record.audio} />
                  <div className="delete-button-container">
                    <button
                      className="delete-button"
                      title="Delete this audio"
                      onClick={() => deleteAudio(record.key)}
                    >
                      trash
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-records">
            !!!
            <span>You don't have records</span>
          </div>
        )}
      </div> */}
    </div>
  )
}
