import { DateInterval } from "../../generated/graphql";

function sortAndRemoveIntervalOverlaps(
  intervals: DateInterval[]
): DateInterval[] {
  let sortedIntervals = intervals.sort(function (a, b) {
    if (a.startTime.getTime() === b.startTime.getTime()) {
      return a.endTime.getTime() - b.endTime.getTime();
    } else {
      return a.startTime.getTime() - b.startTime.getTime();
    }
  });

  let i = 0;
  while (true) {
    if (i >= sortedIntervals.length - 1) {
      break;
    }
    let a = sortedIntervals[i];
    let b = sortedIntervals[i + 1];

    if (a.endTime >= b.startTime) {
      sortedIntervals = sortedIntervals
        .slice(0, i)
        .concat([
          {
            startTime: a.startTime,
            endTime:
              a.endTime.getTime() > b.endTime.getTime() ? a.endTime : b.endTime,
          },
        ])
        .concat(sortedIntervals.slice(i + 2));
    } else {
      i += 1;
    }
  }

  return sortedIntervals;
}

// [[a, b], [c, d]] => [a, b, c, d]
function flattenIntervalList(unflattened: DateInterval[]): Date[] {
  let ret = [];
  for (const interval of unflattened) {
    ret.push(interval.startTime);
    ret.push(interval.endTime);
  }
  return ret;
}

// [a, b, c, d] => [[a, b], [c, d]]
function unflattenIntervalList(flattened: Date[]): DateInterval[] {
  let ret = [];
  for (let i = 0; i < flattened.length; i += 2) {
    if (flattened[i + 1] === undefined) break;
    ret.push({ startTime: flattened[i], endTime: flattened[i + 1] });
  }
  return ret;
}

// Unattainable date, treat as null.
let maxDate = new Date(8640000000000000);

export function mergeIntervalLists(
  intervalListA: DateInterval[],
  intervalListB: DateInterval[],
  operation: (inA: boolean, inB: boolean) => boolean
) {
  let endpointsA: Array<Date> = flattenIntervalList(
    sortAndRemoveIntervalOverlaps(intervalListA)
  );
  let endpointsB: Array<Date> = flattenIntervalList(
    sortAndRemoveIntervalOverlaps(intervalListB)
  );

  endpointsA.push(maxDate);
  endpointsB.push(maxDate);

  let [ai, bi] = [0, 0];
  let res = [];

  let currEndpoint =
    endpointsA[0] < endpointsB[0] ? endpointsA[0] : endpointsB[0];

  while (currEndpoint < maxDate) {
    const inA =
      currEndpoint !== maxDate &&
      endpointsA[ai] < maxDate &&
      (currEndpoint < endpointsA[ai] ? ai % 2 === 1 : ai % 2 === 0);
    const inB =
      currEndpoint !== maxDate &&
      endpointsB[bi] < maxDate &&
      (currEndpoint < endpointsB[bi] ? bi % 2 === 1 : bi % 2 === 0);
    const inRes = operation(inA, inB);

    if (inRes !== (res.length % 2 === 1)) {
      res.push(currEndpoint);
    }
    if (currEndpoint == endpointsA[ai]) ai += 1;
    if (currEndpoint == endpointsB[bi]) bi += 1;

    currEndpoint =
      endpointsA[ai] < endpointsB[bi] ? endpointsA[ai] : endpointsB[bi];
  }
  return unflattenIntervalList(res);
}
