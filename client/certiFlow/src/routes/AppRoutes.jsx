import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Login from "../pages/Login"
import Register from "../pages/Register"
import ProtectedRoute from "../components/ProtectedRoute"
import TrainingCentreDashboard from "../components/TrainingCentreDashboard"
import CreateBatch from "../pages/CreateBatch"
import BatchDetails from "../pages/BatchDetails"
import MyBatches from "../components/MyBatches"
import Certificates from "../pages/Certificates"

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute allowedRoles={["TRAINING_CENTRE"]} />}>
                    <Route
                        path="/training-centre"
                        element={<TrainingCentreDashboard />}
                    />
                    <Route path="create-batch" element={<CreateBatch />} />
                    <Route path="/batches/:batchId" element={<BatchDetails />} />
                    <Route path="/batches" element={<MyBatches />} />
                    <Route path="/certificates" element={<Certificates />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["DISTRICT_OFFICER"]} />}>
                    <Route
                        path="/district"
                        element={<h1>District Officer Dashboard</h1>}
                    />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["STATE_OFFICER"]} />}>
                    <Route
                        path="/state"
                        element={<h1>State Officer Dashboard</h1>}
                    />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                    <Route
                        path="/admin"
                        element={<h1>Admin Dashboard</h1>}
                    />
                </Route>

                <Route
                    path="/unauthorized"
                    element={<h1>403 - Access Denied</h1>}
                />
            </Routes>
        </BrowserRouter>
    )
}