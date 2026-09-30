"use client";

/**
 * components/forms/Field.tsx
 *
 * Underline-only form input — the design system's editorial form treatment.
 * No borders, no rounded corners, no floating labels.
 * A single hairline below the input; gold on focus.
 *
 * Variants: text | email | tel | date | time | textarea | select
 */

import type { ChangeEvent, ReactNode } from "react";

interface BaseProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
}

interface InputProps extends BaseProps {
  type?: "text" | "email" | "tel" | "date" | "time";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
}

interface TextareaProps extends BaseProps {
  type: "textarea";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

interface SelectProps extends BaseProps {
  type: "select";
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}

type FieldProps = InputProps | TextareaProps | SelectProps;

const lineStyle = {
  border: "none",
  borderBottom: "1px solid var(--color-sand)",
  outline: "none",
  background: "transparent",
  width: "100%",
  fontFamily: "var(--font-body)",
  fontSize: "1.0625rem",
  fontWeight: 400,
  color: "var(--color-ink)",
  padding: "0.625rem 0",
  transition: "border-color 150ms ease",
  borderRadius: 0,
} as const;

export function Field(props: FieldProps) {
  const hasError = !!props.error;

  const labelEl = (
    <label
      htmlFor={props.id}
      style={{
        display: "block",
        fontFamily: "var(--font-body)",
        fontSize: "0.6875rem",
        fontWeight: 500,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: hasError ? "#b91c1c" : "var(--color-ink-muted)",
        marginBottom: "0.375rem",
      }}
    >
      {props.label}
      {props.required && (
        <span aria-hidden style={{ color: "var(--color-gold-ink)", marginLeft: "0.25rem" }}>
          *
        </span>
      )}
    </label>
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => props.onChange(e.target.value);

  let inputEl: ReactNode;

  if (props.type === "textarea") {
    inputEl = (
      <textarea
        id={props.id}
        value={props.value}
        onChange={handleChange}
        placeholder={props.placeholder}
        rows={props.rows ?? 4}
        required={props.required}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${props.id}-error` : props.hint ? `${props.id}-hint` : undefined}
        style={{
          ...lineStyle,
          resize: "vertical",
          minHeight: "80px",
        }}
        className="field-input"
      />
    );
  } else if (props.type === "select") {
    inputEl = (
      <select
        id={props.id}
        value={props.value}
        onChange={handleChange}
        required={props.required}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${props.id}-error` : props.hint ? `${props.id}-hint` : undefined}
        style={{ ...lineStyle, appearance: "none", cursor: "pointer" }}
        className="field-input"
      >
        {props.children}
      </select>
    );
  } else {
    inputEl = (
      <input
        id={props.id}
        type={props.type ?? "text"}
        value={props.value}
        onChange={handleChange}
        placeholder={(props as InputProps).placeholder}
        autoComplete={(props as InputProps).autoComplete}
        required={props.required}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${props.id}-error` : props.hint ? `${props.id}-hint` : undefined}
        style={lineStyle}
        className="field-input"
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {labelEl}
      {inputEl}
      {hasError && (
        <p
          id={`${props.id}-error`}
          role="alert"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            color: "#b91c1c",
            marginTop: "0.375rem",
          }}
        >
          {props.error}
        </p>
      )}
      {props.hint && !hasError && (
        <p
          id={`${props.id}-hint`}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            color: "var(--color-ink-muted)",
            marginTop: "0.375rem",
          }}
        >
          {props.hint}
        </p>
      )}
    </div>
  );
}
