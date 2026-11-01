import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import DeckScreen from './screens/DeckScreen';
import PlaySetup from './screens/PlaySetup';
import StudyView from './screens/StudyView';
import DuelPlaceholder from './screens/DuelPlaceholder';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/deck/everyday-essentials" replace />} />
        <Route path="/deck/:id" element={<DeckScreen />} />
        <Route path="/play/:id" element={<PlaySetup />} />
        <Route path="/study/:id" element={<StudyView />} />
        <Route path="/duel-placeholder" element={<DuelPlaceholder />} />
      </Routes>
    </BrowserRouter>
  );
}
