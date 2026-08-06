import React, { useEffect } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";

export default function Toast({ toasts, removeToast }) {
    if (!toasts?.length) return null;
    return (
        <div className="sg-toast-stack">
            {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} onDone={() => removeToast(t.id)} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onDone }) {
    useEffect(() => {
        const timer = setTimeout(onDone, 3500);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const Icon = toast.type === "success" ? CheckCircle2 : toast.type === "error" ? XCircle : Info;

    return (
        <div className={`sg-toast sg-toast-${toast.type}`}>
            <Icon size={15} />
            <span>{toast.message}</span>
        </div>
    );
}

export function useToasts() {
    const [toasts, setToasts] = React.useState([]);
    const pushToast = (type, message) => {
        const id = Date.now() + Math.random();
        setToasts((t) => [...t, { id, type, message }]);
    };
    const removeToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));
    return { toasts, pushToast, removeToast };
}