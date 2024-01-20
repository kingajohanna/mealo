# mypy: disallow_untyped_defs=False
from ._abstract import AbstractScraper


class Nosalty(AbstractScraper):
    @classmethod
    def host(cls):
        return "nosalty.hu"

    def title(self):
        return self.schema.title()

    def total_time(self):
        return self.schema.total_time()

    def yields(self):
        return self.schema.yields()

    def ingredients(self):
        return self.schema.ingredients()

    def instructions(self):
        return self.schema.instructions()

    def ratings(self):
        return self.schema.ratings()
    
    def video(self):
        return self.schema.video()