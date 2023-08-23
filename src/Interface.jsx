import React, { useEffect, useState } from "react";
import useGame from "./useGame.js";

export default function Interface() {
  const {
    mode,
    setMode,
    round,
    resetRound,
    restart,
    playerScore,
    setPlayerScore,
    computerScore,
    setComputerScore,
  } = useGame();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
  }, [isModalOpen]);

  const clearData = () => {
    window.localStorage.clear();
    handleRestart();
  };

  const handleRestart = () => {
    restart();
    resetRound();
    setPlayerScore(0);
    setComputerScore(0);
  };

  const modes = [
    { name: "threeWins", text: "Three Wins" },
    { name: "fiveWins", text: "Five Wins" },
    { name: "endless", text: "Endless" },
  ];

  const modeOptions = modes.map((modeItem) => (
    <div
      key={modeItem.name}
      className={`mode-selection ${
        mode === modeItem.name ? "selected-mode" : ""
      }`}
      onClick={() => {
        setMode(modeItem.name);
        window.localStorage.setItem("mode", modeItem.name);
        handleRestart();
      }}
    >
      {modeItem.text}
    </div>
  ));

  return (
    <>
      <div className="control-buttons">
        <div
          className="control-button"
          id="menu"
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          <img src="./icons/menu.svg" alt="menu" />
        </div>
      </div>
      <div className="score">
        <div className="individual-score">
          Round {round}
          <div className="mode-info">
            {mode === "threeWins"
              ? "Three Wins"
              : mode === "fiveWins"
              ? "Five Wins"
              : "Endless"}
          </div>
        </div>
        <div className="individual-score">You: {playerScore}</div>
        <div className="individual-score">Computer: {computerScore}</div>
      </div>
      {isModalOpen && (
        <div className="modal" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Menu</div>
            <div className="modal-main">
              <div className="section-title">Mode</div>
              <div className="mode-area">{modeOptions}</div>
              <div className="section-title">Data</div>
              <div className="modal-button" onClick={clearData}>
                Clear Data
              </div>
            </div>
            <div className="modal-about-area">
              <div className="modal-about">Computer Graphics Lab Project.</div>
              <div className="modal-about">Rahim & Sajid</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
//npm run dev