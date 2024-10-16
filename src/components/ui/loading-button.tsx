import { ButtonProps } from "./button";
import { Button } from "./button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonProps {
    loading: boolean;
}

const LoadingButton = ({loading, children, className, ...props}: LoadingButtonProps) => {
    

    return (
        <Button {...props} disabled={loading} className={cn('relative', className)}>
            <Loader2 className={cn('animate-spin h-4 w-4 absolute invisible', loading && 'visible')} />
            <span className={cn(loading ? 'invisible' : 'block')}>{children}</span>
        </Button>
    )
}

export default LoadingButton;