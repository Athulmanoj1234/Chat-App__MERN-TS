import * as React from "react"

import { cn } from "@/lib/utils"
import { text } from "body-parser"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          type === "text" ? "bg-slate-400 rounded-2xl w-[500px]" : "",
          type === "file" ? "hidden" : "",
          //value ? "border border-gray-300 rounded-lg p-2" : "",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

const UserInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, value, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          type === "text" ? "border border-gray-300 rounded-lg p-2" : "",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

const RoomIdInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, value, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          type === "text" ? "border border-gray-300 rounded-lg p-2" : "",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input, UserInput, RoomIdInput };
