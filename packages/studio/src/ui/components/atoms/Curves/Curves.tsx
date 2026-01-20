/**
 * Places a hidden svg in the DOM that contains various curve clip paths
 */
export const Curves: React.FC = () => (
  <svg height="0" width="0">
    <defs>
      <clipPath clipPathUnits="objectBoundingBox" id="linearCurve">
        <path d="M0 1L1 0L1 1.01L0 1.01" />
      </clipPath>
      <clipPath clipPathUnits="objectBoundingBox" id="instantCurve">
        <path d="M0 0.9L1 0L1 1.01L0 1.01" />
      </clipPath>
      <clipPath clipPathUnits="objectBoundingBox" id="easeInCurve">
        <path d="M0 1C0.5 1 0.89 1 1 0L1 1.01L0 1.01" />
      </clipPath>
      <clipPath clipPathUnits="objectBoundingBox" id="easeOutCurve">
        <path d="M0 1C0.5 0 0.89 0 1 0L1 1.01L0 1.01" />
      </clipPath>
      <clipPath clipPathUnits="objectBoundingBox" id="easeInOutCurve">
        <path d="M0 1C0.45 1 0.55 0 1 0L1 1.01L0 1.01" />
      </clipPath>
    </defs>
  </svg>
);
