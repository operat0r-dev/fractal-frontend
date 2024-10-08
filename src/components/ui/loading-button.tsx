import { ButtonProps } from "./button";
import { Button } from "./button";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps extends ButtonProps {
    loading: boolean;
}

const LoadingButton = ({loading, children, ...props}: LoadingButtonProps) => {
    return (
        <Button {...props} disabled={loading}>
            {loading ? <Loader2 className="animate-spin h-4 w-4"/> : children}
        </Button>
    )
}

export default LoadingButton;