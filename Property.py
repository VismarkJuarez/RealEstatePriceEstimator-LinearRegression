'''
{
  "averageAreaIncome": 200000,
  "averageAreaNumberOfRooms": 6,
  "averageAreaHouseAge": 120,
  "averageAreaNumberOfBedrooms": 3,
  "areaPopulation": 234000
}
'''
class Property:

    '''
    Constructor initializing all member variables
    '''
    def __init__(self, averageAreaIncome, averageAreaNumberOfRooms, averageAreaHouseAge, averageAreaNumberOfBedrooms, areaPopulation):
        self.averageAreaIncome = averageAreaIncome
        self.averageAreaNumberOfRooms = averageAreaNumberOfRooms
        self.averageAreaHouseAge = averageAreaHouseAge
        self.averageAreaNumberOfBedrooms = averageAreaNumberOfBedrooms
        self.areaPopulation = areaPopulation


