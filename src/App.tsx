import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import MatiksArena from './screens/MatiksArena';
import HomeScreen from './screens/HomeScreen';
import DeckScreen from './screens/DeckScreen';
import PlaySetup from './screens/PlaySetup';
import MatchmakingScreen from './screens/MatchmakingScreen';
import StudyView from './screens/StudyView';
import CountdownScreen from './screens/CountdownScreen';
import DuelScreen from './screens/DuelScreen';
import ResultsScreen from './screens/ResultsScreen';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MatiksArena />} />
        <Route path="/classic" element={<HomeScreen />} />
        <Route path="/deck/:id" element={<DeckScreen />} />
        <Route path="/play/:id" element={<PlaySetup />} />
        <Route path="/matchmaking/:id" element={<MatchmakingScreen />} />
        <Route path="/study/:id" element={<StudyView />} />
        <Route path="/countdown/:id" element={<CountdownScreen />} />
        <Route path="/duel/:id" element={<DuelScreen />} />
        <Route path="/results/:id" element={<ResultsScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
