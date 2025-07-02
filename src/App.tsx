import { Routes, Route } from "react-router";
import { CustomersPage } from "./pages/CustomersPage";
import { LotsPage } from "./pages/LotsPage";
import { PageLayout } from "./pages/PageLayout";

function App() {
    return (<><Routes>
        <Route element={<PageLayout/>}>
            <Route path="/" element={<CustomersPage/>} />
            <Route path="/lots" element={<LotsPage/>} />
        </Route>
        </Routes></>)
}

export default App;