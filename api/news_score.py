class NewsScore:
    ranges = {
        'TEMP': [(31, 35, 3), (35, 36, 1), (36, 38, 0), (38, 39, 1), (39, 42, 2)],
        'HR': [(25, 40, 3), (40, 50, 1), (50, 90, 0), (90, 110, 1), (110, 130, 2), (130, 220, 3)],
        'RR': [(3, 8, 3), (8, 11, 1), (11, 20, 0), (20, 24, 2), (24, 60, 3)],
    }

    def __init__(self, measurements):
        self.measurements = [m for m in measurements if m['type'] in self.ranges.keys()]
        self.score = 0

    @staticmethod
    def __generate_score_for_type(measurement, range):
        score = 0
        for lower, upper, val in range:
            if lower < measurement <= upper:
                score += val
                break
        return score

    @staticmethod
    def get_min_max_for_type(type):
        type_ranges = NewsScore.ranges[type]
        min_val = min(lower for lower, upper, val in type_ranges)
        max_val = max(upper for lower, upper, val in type_ranges)
        return min_val, max_val

    def generate_score(self):
        for m in self.measurements:
            range = NewsScore.ranges[m['type']]
            self.score += self.__generate_score_for_type(m['value'], range)
        return self.score
