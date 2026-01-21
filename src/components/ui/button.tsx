import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const LoaderIcon = Loader2 as any;

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-slate-900 text-slate-50 hover:bg-slate-900/90",
                destructive: "bg-red-500 text-slate-50 hover:bg-red-500/90",
                outline: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
                secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
                ghost: "hover:bg-slate-100 hover:text-slate-900",
                link: "text-slate-900 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
    isLoading?: boolean
}

// React.forwardRef의 제네릭 이슈를 피하기 위해 타입을 직접 정의하지 않고,
// 구현체에서 타입을 추론하게 하거나 Cast합니다.
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, isLoading = false, children, disabled, ...props }, ref) => {
        const Comp = (asChild ? Slot : "button") as any
        const isDisabled = disabled || isLoading;

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={isDisabled}
                {...props}
            >
                {!asChild && isLoading && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </Comp>
        ) as React.ReactElement
    }
) as React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>

Button.displayName = "Button"

export { Button, buttonVariants }
