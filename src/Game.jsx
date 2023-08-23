import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Image, OrbitControls, Text, Float } from "@react-three/drei";
import { Rock } from "./Rock";
import { Paper } from "./Paper";
import { Scissors } from "./Scissors";
import useGame from "./useGame.js";

// Import your sound files
import winSound from "./sound/win.mp3";
import tieSound from "./sound/draw.mp3";
import lossSound from "./sound/fail.mp3";

export default function Game() {
  const options = ["rock", "paper", "scissors"];

  const {
    // Choices and winner
    player,
    setPlayer,
    computer,
    setComputer,
    winner,
    setWinner,
    // Mode
    mode,
    setMode,
    // Round
    round,
    nextRound,
    setRound,
    resetRound,
    // Phases
    phase,
    setPhase,
    start,
    restart,
    end,
    // Scoring
    playerScore,
    setPlayerScore,
    computerScore,
    setComputerScore,
    playerWinsTotal,
    setPlayerWinsTotal,
    computerWinsTotal,
    setComputerWinsTotal,
  } = useGame();

  // Create audio elements for win, tie, and loss sounds
  const winAudio = new Audio(winSound);
  const tieAudio = new Audio(tieSound);
  const lossAudio = new Audio(lossSound);

  // Set preload for audio files and add ended event listeners for cleanup
  winAudio.preload = "auto";
  tieAudio.preload = "auto";
  lossAudio.preload = "auto";

  const cleanupAudio = () => {
    winAudio.removeEventListener("ended", cleanupAudio);
    tieAudio.removeEventListener("ended", cleanupAudio);
    lossAudio.removeEventListener("ended", cleanupAudio);

    winAudio.currentTime = 0;
    tieAudio.currentTime = 0;
    lossAudio.currentTime = 0;
  };

  // Mode
  const [limit, setLimit] = useState(null);

  useEffect(() => {
    switch (mode) {
      case "threeWins":
        setLimit(3);
        break;
      case "fiveWins":
        setLimit(5);
        break;

      case "endless":
        setLimit(Infinity);
        break;
      default:
        setLimit(Infinity);
        break;
    }
  }, [mode]);

  // Game Logic
  useEffect(() => {
    if (Number(round) === 0) {
      restart();

      if (window.localStorage.getItem("phase") === "ended") {
        window.localStorage.setItem("playerScore", 0);
        window.localStorage.setItem("computerScore", 0);
        window.localStorage.setItem("phase", "ready");
      }

      setPlayer(null);
      setComputer(null);
      setWinner(null);
    }

    if (Number(round) === 1) {
      start();
      window.localStorage.setItem("phase", "playing");
    }

    if (Number(playerScore) + Number(computerScore) === limit) {
      end();
      window.localStorage.setItem("phase", "ended");
      window.localStorage.setItem("round", 0);

      if (winner === "player") {
        setPlayerWinsTotal(String(Number(playerWinsTotal) + 1));
        window.localStorage.setItem(
          "playerWinsTotal",
          String(Number(playerWinsTotal) + 1)
        );
      } else {
        setComputerWinsTotal(String(Number(computerWinsTotal) + 1));
        window.localStorage.setItem(
          "computerWinsTotal",
          String(Number(computerWinsTotal) + 1)
        );
      }
    }
  }, [round]);

  //Handle clicks and round winning conditions
  const handleClick = (option) => {
    if (phase !== "ended") {
      nextRound();
      let kround = Number(round) + 1;
      window.localStorage.setItem("round", String(kround));
      const computerOption =
        options[Math.floor(Math.random() * options.length)];

      setPlayer(option);
      setComputer(computerOption);

      if (option === computerOption) {
        setWinner("tie");
        tieAudio.play();
      } else if (
        (option === "rock" && computerOption === "scissors") ||
        (option === "paper" && computerOption === "rock") ||
        (option === "scissors" && computerOption === "paper")
      ) {
        setWinner("player");
        setPlayerScore(String(Number(playerScore) + 1));
        window.localStorage.setItem("playerScore", Number(playerScore) + 1);
        winAudio.play();
      } else {
        setWinner("computer");
        setComputerScore(String(Number(computerScore) + 1));
        window.localStorage.setItem("computerScore", Number(computerScore) + 1);
        lossAudio.play();
      }
    }
  };

  // Handle restart
  const handleRestart = () => {
    restart();
    window.localStorage.setItem("phase", "ready");
    resetRound();
    window.localStorage.setItem("round", 0);
    setPlayerScore(0);
    window.localStorage.setItem("playerScore", 0);
    setComputerScore(0);
    window.localStorage.setItem("computerScore", 0);
  };

  // Objects
  const rock = useRef();
  const paper = useRef();
  const scissors = useRef();

  const [hovered, setHovered] = useState(false);

  const handleHover = (e) => {
    e.stopPropagation();
    setHovered(true);
  };

  const handleUnhover = (e) => {
    e.stopPropagation();
    setHovered(false);
  };

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "default";
    }
  }, [hovered]);

  //Camera
  let cameraY = window.innerWidth < 800 ? 8 : 5;

  //Storage and state initiation
  useEffect(() => {
    // Mode
    let storedMode = window.localStorage.getItem("mode");
    if (storedMode !== null) {
      setMode(storedMode);
    } else {
      window.localStorage.setItem("mode", "endless");
      window.localStorage.setItem("round", 0);
    }

    // Round
    let storedRound = window.localStorage.getItem("round");
    if (storedRound !== null) {
      setRound(storedRound);
    } else {
      window.localStorage.setItem("round", 0);
    }

    // Phase
    let storedPhase = window.localStorage.getItem("phase");
    if (storedPhase !== null) {
      if (storedPhase === "ended") {
        handleRestart();
      }
      setPhase(storedPhase);
    } else {
      window.localStorage.setItem("phase", "ready");
    }

    // Player current score
    let storedPlayerScore = window.localStorage.getItem("playerScore");
    if (storedPlayerScore !== null) {
      setPlayerScore(storedPlayerScore);
    } else {
      window.localStorage.setItem("playerScore", 0);
    }

    // Computer current score
    let storedComputerScore = window.localStorage.getItem("computerScore");
    if (storedComputerScore !== null) {
      setComputerScore(storedComputerScore);
    } else {
      window.localStorage.setItem("computerScore", 0);
    }

    // Player total wins
    let storedPlayerWinsTotal = window.localStorage.getItem("playerWinsTotal");
    if (storedPlayerWinsTotal !== null) {
      setPlayerWinsTotal(storedPlayerWinsTotal);
    } else {
      window.localStorage.setItem("playerWinsTotal", 0);
    }

    // Computer total wins
    let storedComputerWinsTotal =
      window.localStorage.getItem("computerWinsTotal");
    if (storedComputerWinsTotal !== null) {
      setComputerWinsTotal(storedComputerWinsTotal);
    } else {
      window.localStorage.setItem("computerWinsTotal", 0);
    }
  }, []);

  return (
    <Canvas
      camera={{
        near: 0.1,
        far: 50,
        position: [0, 0, cameraY],
      }}
    >
      <OrbitControls />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Rock
        ref={rock}
        position={[-2, -2.35, 0]}
        scale={[5, 5, 5]}
        onClick={() => handleClick("rock")}
        onPointerOver={handleHover}
        onPointerOut={handleUnhover}
      />
      <Paper
        ref={paper}
        position={[0, -2, 0]}
        rotation={[0, Math.PI / 4, 0]}
        onClick={() => handleClick("paper")}
        onPointerOver={handleHover}
        onPointerOut={handleUnhover}
      />
      <Scissors
        ref={scissors}
        position={[2, -2.3, 0]}
        scale={[5.5, 5.5, 5.5]}
        onClick={() => handleClick("scissors")}
        onPointerOver={handleHover}
        onPointerOut={handleUnhover}
      />
      <Float rotationIntensity={1} floatIntensity={0.25}>
        {/* Position of Player chosse */}
        <Text
          fontSize={0.4}
          font="./fonts/nickname.otf"
          color={0x313131}
          position={[-1, 3, 0]}
        >
          Your chose
        </Text>
        {player && (
          <group position={[0.8, 3, 0]}>
            {player === "rock" && (
              <Image
                url="./images/rock.png"
                scale={[1, 1, 1]}
                transparent
                opacity={1}
              />
            )}
            {player === "paper" && (
              <Image
                url="./images/paper.png"
                scale={[1, 1, 1]}
                transparent
                opacity={1}
              />
            )}
            {player === "scissors" && (
              <Image
                url="./images/scissors.png"
                scale={[1, 1, 1]}
                transparent
                opacity={1}
              />
            )}
          </group>
        )}

        {/* Position of Computer chosse */}
        <Text
          fontSize={0.4}
          font="./fonts/nickname.otf"
          color={0x313131}
          position={[-1, 2, 0]}
        >
          Computer chose
        </Text>
        {computer && (
          <group position={[1.2, 2, 0]}>
            {computer === "rock" && (
              <Image
                url="./images/rock.png"
                scale={[1, 1, 1]}
                transparent
                opacity={1}
              />
            )}
            {computer === "paper" && (
              <Image
                url="./images/paper.png"
                scale={[1, 1, 1]}
                transparent
                opacity={1}
              />
            )}
            {computer === "scissors" && (
              <Image
                url="./images/scissors.png"
                scale={[1, 1, 1]}
                transparent
                opacity={1}
              />
            )}
          </group>
        )}

        {winner && (
          <Text
            position={[0, 1, 0]}
            fontSize={0.7}
            font="./fonts/nickname.otf"
            color={0x313131}
          >
            {winner === "tie"
              ? `It is a draw!`
              : winner === "player"
              ? `You win${phase !== "ended" ? "!" : ""}`
              : `Computer wins${phase !== "ended" ? "!" : ""}`}
          </Text>
        )}
        {phase === "ended" && (
          <>
            <Text
              position={[0, 0.2, 0]}
              fontSize={1}
              font="./fonts/nickname.otf"
              color={0x313131}
            >
              The Game!
            </Text>
            <Text
              position={[0, -0.3, 0]}
              fontSize={0.17}
              font="./fonts/nickname.otf"
              color={0x313131}
            >
              (You have won {playerScore} games in total and computer has won{" "}
              {computerScore})
            </Text>
            <Image
              url="./icons/replay.png"
              position={[0, -0.8, 0]}
              scale={[0.6, 0.6, 0.6]}
              transparent
              opacity={0.75}
              onClick={() => handleRestart()}
              onPointerOver={handleHover}
              onPointerOut={handleUnhover}
            />
          </>
        )}
      </Float>
    </Canvas>
  );
}
