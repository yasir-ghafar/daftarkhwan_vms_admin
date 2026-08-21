import React, { useRef } from "react";

const SegmentControl = ({
  options = [],
  value,
  onChange,
  label,
  name,
  disabled = false,
  className = "",
}) => {
  const buttonRefs = useRef([]);
  const selectedIndex = options.findIndex((option) => option.value === value);

  const selectOption = (index) => {
    const option = options[index];
    if (!option || disabled || option.disabled) return;

    if (option.value !== value) onChange?.(option.value);
    buttonRefs.current[index]?.focus();
  };

  const handleKeyDown = (event, index) => {
    if (disabled) return;

    const enabledIndexes = options
      .map((option, optionIndex) => (option.disabled ? -1 : optionIndex))
      .filter((optionIndex) => optionIndex >= 0);

    if (!enabledIndexes.length) return;

    const currentEnabledPos = enabledIndexes.indexOf(index);
    let nextIndex = index;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      nextIndex =
        enabledIndexes[(currentEnabledPos + 1) % enabledIndexes.length];
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      nextIndex =
        enabledIndexes[
          (currentEnabledPos - 1 + enabledIndexes.length) % enabledIndexes.length
        ];
    } else if (event.key === "Home") {
      event.preventDefault();
      nextIndex = enabledIndexes[0];
    } else if (event.key === "End") {
      event.preventDefault();
      nextIndex = enabledIndexes[enabledIndexes.length - 1];
    } else {
      return;
    }

    selectOption(nextIndex);
  };

  return (
    <div className={className}>
      {label ? (
        <p
          id={name ? `${name}-label` : undefined}
          className="mb-1.5 text-sm font-semibold text-gray-700"
        >
          {label}
        </p>
      ) : null}

      <div
        role="radiogroup"
        aria-labelledby={label && name ? `${name}-label` : undefined}
        aria-label={!label ? name : undefined}
        className="inline-flex overflow-hidden rounded-md border border-gray-300 bg-white"
      >
        {options.map((option, index) => {
          const isSelected = option.value === value;
          const isDisabled = disabled || option.disabled;
          const isFirst = index === 0;
          const isLast = index === options.length - 1;

          return (
            <button
              key={option.value}
              ref={(node) => {
                buttonRefs.current[index] = node;
              }}
              type="button"
              role="radio"
              name={name}
              aria-checked={isSelected}
              tabIndex={isSelected || (selectedIndex < 0 && index === 0) ? 0 : -1}
              disabled={isDisabled}
              onClick={() => selectOption(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={[
                "inline-flex h-10 items-center gap-2 px-5 text-sm font-medium whitespace-nowrap transition",
                "focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue focus-visible:ring-inset",
                isFirst ? "rounded-l-[5px]" : "",
                isLast ? "rounded-r-[5px]" : "",
                !isLast ? "border-r border-gray-300" : "",
                isSelected
                  ? "bg-brand-cta text-white hover:bg-brand-dark"
                  : "bg-white text-gray-700 hover:bg-brand-blue-bg",
                isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {option.icon ? (
                <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center [&>svg]:h-4 [&>svg]:w-4">
                  {option.icon}
                </span>
              ) : null}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SegmentControl;
