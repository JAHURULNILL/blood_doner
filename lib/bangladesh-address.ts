import BdAddressImport from "bd-address";

type RawDivision = {
  id: string;
  bn_name: string;
};

type RawDistrict = {
  id: string;
  division_id: string;
  bn_name: string;
};

type RawUpazila = {
  id: string;
  district_id: string;
  bn_name: string;
};

type AddressLibrary = {
  divisions: () => RawDivision[];
  district: (divisionId: string) => RawDistrict[];
  upazilla: (districtId: string) => RawUpazila[];
};

const BdAddress = BdAddressImport as unknown as AddressLibrary;

export const bangladeshDivisions = BdAddress.divisions().map((division) => ({
  id: division.id,
  name: division.bn_name
}));

const districtOptions = bangladeshDivisions.flatMap((division) =>
  BdAddress.district(division.id).map((district) => ({
    id: district.id,
    divisionId: district.division_id,
    divisionName: division.name,
    name: district.bn_name
  }))
);

export function getDistrictOptions(divisionName?: string) {
  if (!divisionName) return [];
  return districtOptions.filter((district) => district.divisionName === divisionName);
}

export function getUpazilaOptions(districtName?: string) {
  if (!districtName) return [];

  const district = districtOptions.find((item) => item.name === districtName);
  if (!district) return [];

  return BdAddress.upazilla(district.id).map((upazila) => ({
    id: upazila.id,
    districtId: upazila.district_id,
    name: upazila.bn_name
  }));
}
