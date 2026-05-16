const Skeleton = ({ width = '100%', height = '1rem', borderRadius = '8px', style = {} }) => (
  <div
    className="skeleton"
    style={{ width, height, borderRadius, ...style }}
  />
)

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <Skeleton height="0.75rem" width="40%" />
    <Skeleton height="2rem" width="60%" style={{ marginTop: '0.75rem' }} />
    <Skeleton height="0.75rem" width="30%" style={{ marginTop: '0.5rem' }} />
  </div>
)

export const SkeletonExpenseItem = () => (
  <div className="skeleton-expense-item">
    <Skeleton width="70px" height="26px" borderRadius="999px" />
    <div style={{ flex: 1 }}>
      <Skeleton height="0.875rem" width="50%" />
      <Skeleton height="0.75rem" width="30%" style={{ marginTop: '4px' }} />
    </div>
    <Skeleton height="1rem" width="80px" />
  </div>
)

export default Skeleton