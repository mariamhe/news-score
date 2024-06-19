from marshmallow import Schema, fields, ValidationError, validates

from news_score import NewsScore


class MeasurementSchema(Schema):
    type = fields.String(required=True)
    value = fields.Integer(required=True)


class MeasurementListSchema(Schema):
    measurements = fields.List(fields.Nested(MeasurementSchema), required=True)

    @validates('measurements')
    def validate_measurements(self, values):
        types = {item['type'] for item in values}
        required_types = set(NewsScore.ranges.keys())

        if not required_types.issubset(types):
            raise ValidationError('All measurements types must be present to receive a score: TEMP, HR, RR')

        for measurement in values:
            type = measurement['type']
            value = measurement['value']
            if type in required_types:
                min_val, max_val = NewsScore.get_min_max_for_type(type)
                if value <= min_val or value > max_val:
                    raise ValidationError(f'{type} value outside of legal range')
