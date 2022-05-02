import React from "react";
import { useReducer } from "react";
import {
  Box,
  Grid,
  GridItem,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

const initialState = {
  squares: Array(9).fill(null),
  xIsNext: true,
  winner: null,
  loading: false,
  draw: null,
  totalGames: 0,
  xWins: 0,
  oWins: 0,
  drawGames: 0,
};

const newGameState = {
  squares: Array(9).fill(null),
  xIsNext: true,
  winner: null,
  loading: false,
  draw: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "click":
      return {
        ...state,
        xIsNext:
          state.squares[action.index] === null ? !state.xIsNext : state.xIsNext,
        squares: state.squares.map((square, index) => {
          // if index is equal to action.index and square is null and winner is null, return xIsNext
          if (index === action.index && square === null && !state.winner) {
            return state.xIsNext ? "X" : "O";
          }
          // else return square
          return square;
        }),
      };
    case "winner":
      return {
        ...state,
        winner: action.payload,
      };
    case "loading":
      return {
        ...state,
        loading: action.payload,
      };
    case "draw":
      return {
        ...state,
        draw: true,
      };
    case "reset":
      return {
        ...state,
        ...newGameState,
        totalGames: state.totalGames + 1,
        xWins: state.xWins + (state.winner === "X" ? 1 : 0),
        oWins: state.oWins + (state.winner === "O" ? 1 : 0),
        drawGames: state.drawGames + (state.draw ? 1 : 0),
      };
    default:
      throw new Error();
  }
};

const winnerLine = (line) => {
  const [a, b, c] = line;
  // if all squares are not null and a is equal to b and b is equal to c, return true
  if (a && a === b && a === c) return true;
  return null;
};

// possible winning lines
const possibleWins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const Board = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    squares,
    xIsNext,
    winner,
    loading,
    draw,
    totalGames,
    xWins,
    oWins,
    drawGames,
  } = state;

  // css for center
  const center = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  // function return square box
  const square = (index, value) => {
    return (
      <GridItem
        key={index}
        h="6rem"
        fontSize={"3.5rem"}
        color={value === "X" ? "red.500" : "green.500"}
        styles={center}
        bg="white"
        cursor="pointer"
        onClick={() => dispatch({ type: "click", index })}
      >
        {value}
      </GridItem>
    );
  };

  // game reset function
  const newGame = () => {
    dispatch({ type: "loading", payload: true });

    setTimeout(() => {
      dispatch({ type: "reset" });
      dispatch({ type: "loading", payload: false });
    }, 500);
  };

  // checking for winner every time a square is clicked
  !winner &&
    possibleWins.forEach((line) => {
      const [a, b, c] = line;
      const winner = winnerLine([squares[a], squares[b], squares[c]]);
      winner ? dispatch({ type: "winner", payload: squares[a] }) : null;
    });

  // checking for draw
  !draw && squares.every((square) => square !== null)
    ? dispatch({ type: "draw" })
    : null;

  return (
    <>
      <Box>
        <Box
          fontSize={"3rem"}
          m="2"
          bg="green.500"
          color="white"
          borderRadius={"10px"}
        >
          Tic Tac Toe
        </Box>
        <Box w="350px"  m="1.3rem auto" style={{ ...center, justifyContent: "center" }}>
          <Box
            fontSize={"1rem"}
            fontWeight="500"
            w="30%"
            p="1"
            style={{ textAlign: "left" }}
          >
            X Wins: {xWins}
            <br />
            {"       "} O Wins: {oWins}
          </Box>
          <Box fontSize={"2rem"} m="1" w="60%" style={{ textAlign: "left" }}>
            {winner
              ? `Winner: ${winner}`
              : draw
              ? "Game Over"
              : `Next player: ${xIsNext ? "X" : "O"}`}
          </Box>
        </Box>

        {loading ? (
          <Box h="18.5rem" w="18rem" m="auto" style={center}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Box>
        ) : winner || draw ? (
          <Box h="18.5rem" w="18rem" m="auto" style={center}>
            <Alert
              status={winner ? "success" : "warning"}
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="200px"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                {winner ? "Winner Winner Chicken Dinner 🏆" : "Game Over!"}
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                {winner ? `Winner: ${winner}` : "Ohh no! It's a draw!"}
              </AlertDescription>
            </Alert>
          </Box>
        ) : (
          <Grid
            w="295px"
            m="auto"
            templateColumns="repeat(3, 6rem)"
            gap={1}
            textAlign="center"
            bg="green.800"
          >
            {" "}
            {squares.map((value, index) => square(index, value))}
          </Grid>
        )}

        <Box>
          <Button
            disabled={loading}
            colorScheme="green"
            onClick={newGame}
            w="295px"
            m="5"
          >
            New Game
          </Button>
        </Box>
      </Box>
    </>
  );
};

// {
//
// }
