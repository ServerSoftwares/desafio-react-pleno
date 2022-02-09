import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import CustomRouter from "./components/CustomRouter";
import { Provider } from 'react-redux';

import store from "./store";

function App() {

    return (
    <Provider store={store}>
        <div className="main-wrapper">
            <Header />
            <Sidebar />
            <CustomRouter />
        </div>
    </Provider>
    );

}

export default App;
