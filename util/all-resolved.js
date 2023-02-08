async function allResolved(promises) {
  const reasons = [];
  const values = [];

  const results = await Promise.allSettled(promises);
  results.forEach((r) => {
    if (r.status === "rejected") {
      reasons.push(r.reason);
    } else {
      values.push(r.value);
    }
  });

  if (reasons.length > 0) {
    throw new Error(reasons.join("\n"));
  } else {
    return values;
  }
}

export default allResolved;
