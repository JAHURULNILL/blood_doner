import 'dart:async';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

const kRed = Color(0xFFC62828);
const kRed2 = Color(0xFFE53935);
const kRedSoft = Color(0xFFFFEBEE);
const kRedMid = Color(0xFFFFCDD2);
const kBg = Color(0xFFF8F9FA);
const kCard = Color(0xFFFFFFFF);
const kText = Color(0xFF1A1A2E);
const kText2 = Color(0xFF5C6370);
const kText3 = Color(0xFF9EA7B3);
const kBorder = Color(0xFFF0F0F5);
const kGreen = Color(0xFF2E7D32);
const kGreenSoft = Color(0xFFE8F5E9);
const kOrange = Color(0xFFE65100);
const kOrangeSoft = Color(0xFFFFF3E0);

const kScreenPadding = 14.0;
const kCardPadding = 14.0;
const kCardGap = 10.0;
const kSectionGap = 14.0;
const _bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const kCardShadow = [
  BoxShadow(color: Color(0x0F000000), blurRadius: 16, offset: Offset(0, 4)),
  BoxShadow(color: Color(0x0A000000), blurRadius: 4, offset: Offset(0, 1)),
];

const kRedShadow = [
  BoxShadow(color: Color(0x40C62828), blurRadius: 20, offset: Offset(0, 4)),
];

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (AppEnv.isConfigured) {
    await Supabase.initialize(
      url: AppEnv.supabaseUrl,
      anonKey: AppEnv.supabaseAnonKey,
    );
  }
  runApp(const BeraNativeApp());
}

class AppEnv {
  static const supabaseUrl =
      String.fromEnvironment('SUPABASE_URL', defaultValue: '');
  static const supabaseAnonKey =
      String.fromEnvironment('SUPABASE_ANON_KEY', defaultValue: '');

  static bool get isConfigured =>
      supabaseUrl.isNotEmpty && supabaseAnonKey.isNotEmpty;
}

class BeraNativeApp extends StatefulWidget {
  const BeraNativeApp({super.key});

  @override
  State<BeraNativeApp> createState() => _BeraNativeAppState();
}

class _BeraNativeAppState extends State<BeraNativeApp> {
  late final AppRepository repository;
  late final GoRouter router;

  @override
  void initState() {
    super.initState();
    repository = AppRepository();
    router = GoRouter(
      routes: [
        StatefulShellRoute.indexedStack(
          builder: (context, state, navigationShell) => AppShell(
            navigationShell: navigationShell,
          ),
          branches: [
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/',
                  builder: (_, __) => HomeScreen(repository: repository),
                ),
              ],
            ),
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/donors',
                  builder: (_, __) => DonorsScreen(repository: repository),
                ),
              ],
            ),
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/requests',
                  builder: (_, __) => RequestsScreen(repository: repository),
                ),
              ],
            ),
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/campaigns',
                  builder: (_, __) => CampaignsScreen(repository: repository),
                ),
              ],
            ),
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/account',
                  builder: (_, __) => AccountScreen(repository: repository),
                ),
              ],
            ),
          ],
        ),
        GoRoute(
          path: '/request/new',
          builder: (_, __) => CreateRequestScreen(repository: repository),
        ),
        GoRoute(
          path: '/profile/edit',
          builder: (_, __) => EditProfileScreen(repository: repository),
        ),
        GoRoute(
          path: '/awareness',
          builder: (_, __) => AwarenessScreen(repository: repository),
        ),
        GoRoute(
          path: '/banks',
          builder: (_, __) => BloodBanksScreen(repository: repository),
        ),
        GoRoute(
          path: '/organizations',
          builder: (_, __) => OrganizationsScreen(repository: repository),
        ),
        GoRoute(
          path: '/organizations/new',
          builder: (_, __) => CreateOrganizationScreen(repository: repository),
        ),
        GoRoute(
          path: '/organizations/:slug',
          builder: (_, state) => OrganizationDetailsScreen(
            repository: repository,
            slug: state.pathParameters['slug']!,
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      title: 'বেড়া রক্তদাতা ইউনিট',
      theme: buildAppTheme(),
      routerConfig: router,
    );
  }
}

ThemeData buildAppTheme() {
  final scheme = ColorScheme.fromSeed(
    seedColor: kRed,
    primary: kRed,
    secondary: kRed2,
    surface: kCard,
  );

  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    scaffoldBackgroundColor: kBg,
    fontFamily: 'HindSiliguri',
    splashFactory: NoSplash.splashFactory,
    cardColor: kCard,
    dividerColor: kBorder,
    textSelectionTheme: const TextSelectionThemeData(cursorColor: kRed),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: kBg,
      hintStyle: bodyStyle(color: kText3),
      contentPadding:
          const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: kBorder, width: 1.5),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: kRed, width: 1.5),
      ),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: kBorder, width: 1.5),
      ),
    ),
    textTheme: TextTheme(
      bodyLarge: bodyStyle(),
      bodyMedium: bodyStyle(),
      titleLarge: titleStyle(),
      titleMedium: sectionTitleStyle(),
      titleSmall: labelStyle(),
    ),
  );
}

TextStyle poppins({
  double size = 13,
  FontWeight weight = FontWeight.w700,
  Color color = kText,
  double height = 1.2,
  double? letterSpacing,
}) {
  return TextStyle(
    fontFamily: 'Poppins',
    fontSize: size,
    fontWeight: weight,
    color: color,
    height: height,
    letterSpacing: letterSpacing,
  );
}

TextStyle hind({
  double size = 12,
  FontWeight weight = FontWeight.w400,
  Color color = kText2,
  double height = 1.35,
  double? letterSpacing,
}) {
  return TextStyle(
    fontFamily: 'HindSiliguri',
    fontSize: size,
    fontWeight: weight,
    color: color,
    height: height,
    letterSpacing: letterSpacing,
  );
}

TextStyle pageTitleStyle({Color color = kText}) =>
    poppins(size: 18, weight: FontWeight.w700, color: color);
TextStyle sectionTitleStyle({Color color = kText}) =>
    poppins(size: 13, weight: FontWeight.w700, color: color);
TextStyle cardTitleStyle({Color color = kText}) =>
    poppins(size: 13, weight: FontWeight.w700, color: color);
TextStyle bodyStyle({Color color = kText2, FontWeight weight = FontWeight.w400}) =>
    hind(size: 12, weight: weight, color: color);
TextStyle labelStyle({Color color = kText3}) =>
    poppins(size: 10, weight: FontWeight.w600, color: color);
TextStyle captionStyle({Color color = kText3}) =>
    hind(size: 9, weight: FontWeight.w400, color: color, height: 1.25);
TextStyle titleStyle({Color color = kText}) =>
    poppins(size: 16, weight: FontWeight.w700, color: color);

class AppRepository {
  SupabaseClient? get client => AppEnv.isConfigured ? Supabase.instance.client : null;

  User? get currentUser => client?.auth.currentUser;

  Stream<AuthState> authChanges() {
    if (client == null) return const Stream.empty();
    return client!.auth.onAuthStateChange;
  }

  Future<int> count(String table, {Map<String, dynamic>? filters}) async {
    final db = client;
    if (db == null) return 0;
    dynamic query = db.from(table);
    filters?.forEach((key, value) {
      query = query.eq(key, value);
    });
    return await query.count();
  }

  Future<List<DonorItem>> fetchDonors({String? bloodGroup}) async {
    final db = client;
    if (db == null) return DonorItem.demo;
    dynamic query = db
        .from('donor_profiles')
        .select('*')
        .order('updated_at', ascending: false);
    if (bloodGroup != null && bloodGroup.isNotEmpty) {
      query = query.eq('blood_group', bloodGroup);
    }
    final data = await query as List<dynamic>;
    return data.map(DonorItem.fromMap).toList();
  }

  Future<List<RequestItem>> fetchRequests({String? bloodGroup}) async {
    final db = client;
    if (db == null) return RequestItem.demo;
    dynamic query = db
        .from('blood_requests')
        .select('*')
        .order('created_at', ascending: false);
    if (bloodGroup != null && bloodGroup.isNotEmpty) {
      query = query.eq('blood_group', bloodGroup);
    }
    final data = await query as List<dynamic>;
    return data.map(RequestItem.fromMap).toList();
  }

  Future<List<CampaignItem>> fetchCampaigns() async {
    final db = client;
    if (db == null) return CampaignItem.demo;
    final data =
        await db.from('campaigns').select('*').order('event_date') as List<dynamic>;
    return data.map(CampaignItem.fromMap).toList();
  }

  Future<List<AwarenessItem>> fetchAwareness() async {
    final db = client;
    if (db == null) return AwarenessItem.demo;
    final data = await db
        .from('blogs')
        .select('*')
        .order('published_at', ascending: false) as List<dynamic>;
    return data.map(AwarenessItem.fromMap).toList();
  }

  Future<List<BloodBankItem>> fetchBloodBanks() async {
    final db = client;
    if (db == null) return BloodBankItem.demo;
    final data =
        await db.from('blood_banks').select('*').order('name') as List<dynamic>;
    return data.map(BloodBankItem.fromMap).toList();
  }

  Future<List<OrganizationItem>> fetchOrganizations() async {
    final db = client;
    if (db == null) return OrganizationItem.demo;
    final orgData =
        await db.from('organizations').select('*').order('name') as List<dynamic>;
    final userData =
        await db.from('users').select('organization_id') as List<dynamic>;

    final counts = <String, int>{};
    for (final row in userData) {
      final orgId = row['organization_id']?.toString();
      if (orgId == null || orgId.isEmpty) continue;
      counts[orgId] = (counts[orgId] ?? 0) + 1;
    }

    return orgData
        .map((item) => OrganizationItem.fromMap(
              item,
              counts[item['id']?.toString() ?? ''] ?? 0,
            ))
        .toList();
  }

  Future<List<MemberItem>> fetchOrganizationMembers(String organizationId) async {
    final db = client;
    if (db == null) return MemberItem.demo;
    final users = await db
        .from('users')
        .select('*')
        .eq('organization_id', organizationId) as List<dynamic>;
    final ids = users.map((e) => e['id'].toString()).toList();
    List<dynamic> donors = [];
    if (ids.isNotEmpty) {
      donors = await db
          .from('donor_profiles')
          .select('*')
          .inFilter('user_id', ids) as List<dynamic>;
    }
    final donorMap = {
      for (final donor in donors) donor['user_id'].toString(): donor,
    };
    return users
        .map((user) => MemberItem.fromMap(
              user,
              donorMap[user['id'].toString()] as Map<String, dynamic>?,
            ))
        .toList();
  }

  Future<HomeBundle> homeBundle() async {
    return HomeBundle(
      donors: (await fetchDonors()).take(3).toList(),
      requests: (await fetchRequests()).take(3).toList(),
      campaigns: (await fetchCampaigns()).take(3).toList(),
      awareness: (await fetchAwareness()).take(3).toList(),
      organizations: (await fetchOrganizations()).take(4).toList(),
      totalUsers: await count('users'),
      totalDonors: await count('donor_profiles'),
      totalRequests: await count('blood_requests'),
    );
  }

  Future<ProfileBundle?> myProfile() async {
    final db = client;
    final user = currentUser;
    if (db == null || user == null) return null;

    final userRow =
        await db.from('users').select('*').eq('id', user.id).maybeSingle();
    final donorRow = await db
        .from('donor_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

    OrganizationItem? org;
    final orgId = userRow?['organization_id']?.toString();
    if (orgId != null && orgId.isNotEmpty) {
      final orgRow =
          await db.from('organizations').select('*').eq('id', orgId).maybeSingle();
      if (orgRow != null) {
        org = OrganizationItem.fromMap(orgRow, 0);
      }
    }
    return ProfileBundle(
      userRow: Map<String, dynamic>.from(userRow ?? {}),
      donorRow: donorRow == null ? null : Map<String, dynamic>.from(donorRow),
      organization: org,
    );
  }

  Future<AuthResponse> signIn(String email, String password) async {
    final db = client;
    if (db == null) throw Exception('Supabase config missing');
    return db.auth.signInWithPassword(email: email, password: password);
  }

  Future<AuthResponse> signUp({
    required String fullName,
    required String phone,
    required String email,
    required String password,
    String? organizationId,
  }) async {
    final db = client;
    if (db == null) throw Exception('Supabase config missing');
    return db.auth.signUp(
      email: email,
      password: password,
      data: {
        'full_name': fullName,
        'phone': phone,
        'organization_id': organizationId,
      },
    );
  }

  Future<void> signOut() async {
    await client?.auth.signOut();
  }

  Future<void> saveDonorProfile(Map<String, dynamic> payload) async {
    final db = client;
    final user = currentUser;
    if (db == null || user == null) throw Exception('Login required');
    await db.from('donor_profiles').upsert({
      ...payload,
      'user_id': user.id,
      'email': user.email,
    });
  }

  Future<void> createRequest(Map<String, dynamic> payload) async {
    final db = client;
    final user = currentUser;
    if (db == null || user == null) throw Exception('Login required');
    await db.from('blood_requests').insert({
      ...payload,
      'created_by': user.id,
      'status': 'Open',
    });
  }

  Future<void> createOrganization(Map<String, dynamic> payload) async {
    final db = client;
    final user = currentUser;
    if (db == null || user == null) throw Exception('Login required');
    await db.from('organizations').insert({
      ...payload,
      'created_by': user.id,
    });
  }
}

class HomeBundle {
  HomeBundle({
    required this.donors,
    required this.requests,
    required this.campaigns,
    required this.awareness,
    required this.organizations,
    required this.totalUsers,
    required this.totalDonors,
    required this.totalRequests,
  });

  final List<DonorItem> donors;
  final List<RequestItem> requests;
  final List<CampaignItem> campaigns;
  final List<AwarenessItem> awareness;
  final List<OrganizationItem> organizations;
  final int totalUsers;
  final int totalDonors;
  final int totalRequests;

  factory HomeBundle.demo() => HomeBundle(
        donors: DonorItem.demo,
        requests: RequestItem.demo,
        campaigns: CampaignItem.demo,
        awareness: AwarenessItem.demo,
        organizations: OrganizationItem.demo,
        totalUsers: 462,
        totalDonors: 201,
        totalRequests: 47,
      );
}

class ProfileBundle {
  const ProfileBundle({
    required this.userRow,
    required this.donorRow,
    required this.organization,
  });

  final Map<String, dynamic> userRow;
  final Map<String, dynamic>? donorRow;
  final OrganizationItem? organization;
}

class DonorItem {
  const DonorItem({
    required this.id,
    required this.name,
    required this.phone,
    required this.bloodGroup,
    required this.location,
    required this.lastDonation,
    required this.totalDonation,
    required this.verified,
  });

  final String id;
  final String name;
  final String phone;
  final String bloodGroup;
  final String location;
  final String? lastDonation;
  final int totalDonation;
  final bool verified;

  bool get eligible {
    if (lastDonation == null || lastDonation!.isEmpty) return true;
    final parsed = DateTime.tryParse(lastDonation!);
    if (parsed == null) return true;
    return DateTime.now().difference(parsed).inDays >= 90;
  }

  String get availabilityText => eligible ? 'সময় হয়েছে' : 'সময় হয়নি';

  factory DonorItem.fromMap(dynamic raw) {
    final map = Map<String, dynamic>.from(raw as Map);
    return DonorItem(
      id: map['id'].toString(),
      name: (map['full_name'] ?? '').toString(),
      phone: (map['phone'] ?? '').toString(),
      bloodGroup: (map['blood_group'] ?? '').toString(),
      location: '${map['upazila'] ?? ''}, ${map['district'] ?? ''}',
      lastDonation: map['last_donated_at']?.toString(),
      totalDonation: ((map['total_donations'] ?? 0) as num).toInt(),
      verified: map['is_verified'] == true,
    );
  }

  static const demo = [
    DonorItem(
      id: '1',
      name: 'Md Jahurul Haque',
      phone: '01799298672',
      bloodGroup: 'B+',
      location: 'সুজানগর, পাবনা',
      lastDonation: '2025-11-04',
      totalDonation: 4,
      verified: true,
    ),
    DonorItem(
      id: '2',
      name: 'Md Abu Bokkar',
      phone: '01711111111',
      bloodGroup: 'O+',
      location: 'বেড়া, পাবনা',
      lastDonation: '2025-09-10',
      totalDonation: 3,
      verified: true,
    ),
    DonorItem(
      id: '3',
      name: 'আরিফ হোসেন',
      phone: '01733333333',
      bloodGroup: 'A+',
      location: 'সাঁথিয়া, পাবনা',
      lastDonation: '2026-03-20',
      totalDonation: 1,
      verified: false,
    ),
  ];
}

class RequestItem {
  const RequestItem({
    required this.id,
    required this.patientName,
    required this.bloodGroup,
    required this.hospital,
    required this.location,
    required this.units,
    required this.contactPhone,
    required this.urgency,
    required this.requiredDate,
    required this.status,
  });

  final String id;
  final String patientName;
  final String bloodGroup;
  final String hospital;
  final String location;
  final int units;
  final String contactPhone;
  final String urgency;
  final String requiredDate;
  final String status;

  factory RequestItem.fromMap(dynamic raw) {
    final map = Map<String, dynamic>.from(raw as Map);
    return RequestItem(
      id: map['id'].toString(),
      patientName: (map['patient_name'] ?? '').toString(),
      bloodGroup: (map['blood_group'] ?? '').toString(),
      hospital: (map['hospital_name'] ?? '').toString(),
      location: '${map['upazila'] ?? ''}, ${map['district'] ?? ''}',
      units: ((map['quantity_bags'] ?? 0) as num).toInt(),
      contactPhone: (map['contact_phone'] ?? '').toString(),
      urgency: (map['urgency'] ?? '').toString(),
      requiredDate: (map['required_date'] ?? '').toString(),
      status: (map['status'] ?? '').toString(),
    );
  }

  static const demo = [
    RequestItem(
      id: '1',
      patientName: 'রায়হান',
      bloodGroup: 'O+',
      hospital: 'বেড়া উপজেলা স্বাস্থ্য কমপ্লেক্স',
      location: 'বেড়া, পাবনা',
      units: 2,
      contactPhone: '01744444444',
      urgency: 'Emergency',
      requiredDate: '2026-04-22',
      status: 'Open',
    ),
    RequestItem(
      id: '2',
      patientName: 'শাওন',
      bloodGroup: 'B+',
      hospital: 'ঢাকা মেডিকেল',
      location: 'ঢাকা',
      units: 1,
      contactPhone: '01755555555',
      urgency: 'Urgent',
      requiredDate: '2026-04-23',
      status: 'Open',
    ),
  ];
}

class CampaignItem {
  const CampaignItem({
    required this.id,
    required this.title,
    required this.summary,
    required this.location,
    required this.eventDate,
    required this.organizer,
  });

  final String id;
  final String title;
  final String summary;
  final String location;
  final String eventDate;
  final String organizer;

  String get state {
    final date = DateTime.tryParse(eventDate);
    if (date == null) return 'আসন্ন';
    final diff = DateTime.now().difference(date).inDays;
    if (diff < 0) return 'আসন্ন';
    if (diff <= 1) return 'চলমান';
    return 'সম্পন্ন';
  }

  factory CampaignItem.fromMap(dynamic raw) {
    final map = Map<String, dynamic>.from(raw as Map);
    return CampaignItem(
      id: map['id'].toString(),
      title: (map['title'] ?? '').toString(),
      summary: (map['summary'] ?? '').toString(),
      location: (map['location'] ?? '').toString(),
      eventDate: (map['event_date'] ?? '').toString(),
      organizer: (map['organizer'] ?? '').toString(),
    );
  }

  static const demo = [
    CampaignItem(
      id: '1',
      title: 'ফ্রি মেডিকেল ক্যাম্প',
      summary: 'বিনামূল্যে স্বাস্থ্যসেবা ও রক্তদাতা নিবন্ধন',
      location: 'বেড়া উপজেলা',
      eventDate: '2026-04-24',
      organizer: 'বেড়া রক্তদাতা ইউনিট',
    ),
    CampaignItem(
      id: '2',
      title: 'বিশ্ব রক্তদাতা দিবস ক্যাম্প',
      summary: 'রক্তদানের গুরুত্ব নিয়ে জনসচেতনতা',
      location: 'পাবনা সদর',
      eventDate: '2026-05-10',
      organizer: 'বেড়া রক্তদাতা ইউনিট',
    ),
  ];
}

class AwarenessItem {
  const AwarenessItem({
    required this.id,
    required this.title,
    required this.excerpt,
    required this.author,
    required this.date,
  });

  final String id;
  final String title;
  final String excerpt;
  final String author;
  final String date;

  factory AwarenessItem.fromMap(dynamic raw) {
    final map = Map<String, dynamic>.from(raw as Map);
    return AwarenessItem(
      id: map['id'].toString(),
      title: (map['title'] ?? '').toString(),
      excerpt: (map['excerpt'] ?? '').toString(),
      author: (map['author_name'] ?? '').toString(),
      date: (map['published_at'] ?? '').toString(),
    );
  }

  static const demo = [
    AwarenessItem(
      id: '1',
      title: 'রক্তদানের আগে ও পরে কী করবেন?',
      excerpt: 'রক্তদানের আগে বিশ্রাম, পরে পানি ও হালকা খাবার খুব জরুরি।',
      author: 'ডা. তানভীর',
      date: '2026-04-08',
    ),
    AwarenessItem(
      id: '2',
      title: 'কারা রক্ত দিতে পারবেন না?',
      excerpt: 'সাময়িক অসুস্থতা, কম ওজন বা কিছু ওষুধ চললে অপেক্ষা করা উচিত।',
      author: 'বেড়া রক্তদাতা ইউনিট',
      date: '2026-04-10',
    ),
  ];
}

class BloodBankItem {
  const BloodBankItem({
    required this.id,
    required this.name,
    required this.type,
    required this.address,
    required this.phone,
    required this.verified,
  });

  final String id;
  final String name;
  final String type;
  final String address;
  final String phone;
  final bool verified;

  factory BloodBankItem.fromMap(dynamic raw) {
    final map = Map<String, dynamic>.from(raw as Map);
    return BloodBankItem(
      id: map['id'].toString(),
      name: (map['name'] ?? '').toString(),
      type: (map['type'] ?? '').toString(),
      address: (map['address'] ?? '').toString(),
      phone: (map['phone'] ?? '').toString(),
      verified: map['verified'] == true,
    );
  }

  static const demo = [
    BloodBankItem(
      id: '1',
      name: 'বেড়া উপজেলা স্বাস্থ্য কমপ্লেক্স',
      type: 'hospital',
      address: 'বেড়া, পাবনা',
      phone: '01766666666',
      verified: true,
    ),
  ];
}

class OrganizationItem {
  const OrganizationItem({
    required this.id,
    required this.name,
    required this.slug,
    required this.description,
    required this.location,
    required this.phone,
    required this.memberCount,
  });

  final String id;
  final String name;
  final String slug;
  final String description;
  final String location;
  final String phone;
  final int memberCount;

  factory OrganizationItem.fromMap(dynamic raw, int memberCount) {
    final map = Map<String, dynamic>.from(raw as Map);
    return OrganizationItem(
      id: map['id'].toString(),
      name: (map['name'] ?? '').toString(),
      slug: (map['slug'] ?? '').toString(),
      description: (map['description'] ?? '').toString(),
      location: '${map['upazila'] ?? ''}, ${map['district'] ?? ''}',
      phone: (map['contact_phone'] ?? '').toString(),
      memberCount: memberCount,
    );
  }

  static const demo = [
    OrganizationItem(
      id: '1',
      name: 'বেড়া রক্তদাতা ইউনিট',
      slug: 'bera-raktodata-unit',
      description: 'বেড়ার সক্রিয় রক্তদাতা ও স্বেচ্ছাসেবী সংগঠন',
      location: 'বেড়া, পাবনা',
      phone: '01777777777',
      memberCount: 18,
    ),
  ];
}

class MemberItem {
  const MemberItem({
    required this.id,
    required this.name,
    required this.phone,
    required this.bloodGroup,
  });

  final String id;
  final String name;
  final String phone;
  final String bloodGroup;

  factory MemberItem.fromMap(dynamic raw, Map<String, dynamic>? donor) {
    final map = Map<String, dynamic>.from(raw as Map);
    return MemberItem(
      id: map['id'].toString(),
      name: (map['full_name'] ?? '').toString(),
      phone: (map['phone'] ?? '').toString(),
      bloodGroup: (donor?['blood_group'] ?? '—').toString(),
    );
  }

  static const demo = [
    MemberItem(
      id: '1',
      name: 'Md Jahurul Haque',
      phone: '01799298672',
      bloodGroup: 'B+',
    ),
  ];
}

class AppShell extends StatelessWidget {
  const AppShell({super.key, required this.navigationShell});

  final StatefulNavigationShell navigationShell;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: Container(
        height: 66,
        decoration: const BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: kBorder)),
          boxShadow: [
            BoxShadow(
              color: Color(0x0F000000),
              blurRadius: 20,
              offset: Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          top: false,
          child: Stack(
            clipBehavior: Clip.none,
            alignment: Alignment.topCenter,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  NavButton(
                    icon: Icons.home_rounded,
                    label: 'হোম',
                    active: navigationShell.currentIndex == 0,
                    onTap: () => navigationShell.goBranch(0),
                  ),
                  NavButton(
                    icon: Icons.search_rounded,
                    label: 'দাতা',
                    active: navigationShell.currentIndex == 1,
                    onTap: () => navigationShell.goBranch(1),
                  ),
                  const SizedBox(width: 60),
                  NavButton(
                    icon: Icons.campaign_rounded,
                    label: 'ক্যাম্পেইন',
                    active: navigationShell.currentIndex == 3,
                    onTap: () => navigationShell.goBranch(3),
                  ),
                  NavButton(
                    icon: Icons.person_rounded,
                    label: 'আমার',
                    active: navigationShell.currentIndex == 4,
                    onTap: () => navigationShell.goBranch(4),
                  ),
                ],
              ),
              Positioned(
                top: -18,
                child: GestureDetector(
                  onTap: () => navigationShell.goBranch(2),
                  child: Container(
                    width: 48,
                    height: 48,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(colors: [kRed2, kRed]),
                      boxShadow: kRedShadow,
                    ),
                    child: const Icon(
                      Icons.water_drop_rounded,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class NavButton extends StatelessWidget {
  const NavButton({
    super.key,
    required this.icon,
    required this.label,
    required this.active,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final color = active ? kRed : kText.withValues(alpha: 0.28);
    return Expanded(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.only(top: 8),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: color, size: 22),
              const SizedBox(height: 3),
              Text(
                label,
                style: poppins(
                  size: 10,
                  weight: FontWeight.w700,
                  color: active ? kRed : kText3,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key, required this.repository});

  final AppRepository repository;

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<HomeBundle>(
      future: repository.homeBundle(),
      builder: (context, snapshot) {
        final data = snapshot.data ?? HomeBundle.demo();
        return Scaffold(
          backgroundColor: kBg,
          body: ListView(
            padding: EdgeInsets.zero,
            children: [
              HomeHeader(
                onFindTap: () => context.go('/donors'),
                onOrganizationTap: () => context.push('/organizations/new'),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(
                  kScreenPadding,
                  12,
                  kScreenPadding,
                  16,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    StatsStrip(
                      totalUsers: data.totalUsers,
                      totalDonors: data.totalDonors,
                      totalRequests: data.totalRequests,
                    ),
                    const SizedBox(height: kSectionGap),
                    const QuickActionGrid(),
                    const SizedBox(height: kSectionGap),
                    const UrgentBanner(),
                    const SizedBox(height: kSectionGap),
                    SectionHeading(
                      title: 'সাম্প্রতিক রক্তদাতা',
                      action: 'সব দেখুন',
                      onTap: () => context.go('/donors'),
                    ),
                    const SizedBox(height: 10),
                    ...data.donors.map((donor) => Padding(
                          padding: const EdgeInsets.only(bottom: kCardGap),
                          child: DonorMiniCard(donor: donor),
                        )),
                    const SizedBox(height: kSectionGap),
                    const BenefitsPanel(),
                    const SizedBox(height: kSectionGap),
                    SectionHeading(
                      title: 'ক্যাম্পেইন',
                      action: 'সব দেখুন',
                      onTap: () => context.go('/campaigns'),
                    ),
                    const SizedBox(height: 10),
                    ...data.campaigns.asMap().entries.map(
                          (entry) => Padding(
                            padding: const EdgeInsets.only(bottom: kCardGap),
                            child: CampaignCard(
                              item: entry.value,
                              imagePath: entry.key.isEven
                                  ? 'assets/images/one.jpg'
                                  : 'assets/images/two.jpg',
                            ),
                          ),
                        ),
                    const SizedBox(height: kSectionGap),
                    const Text('সাধারণ জিজ্ঞাসাবলি',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: kText,
                        )),
                    const SizedBox(height: 10),
                    const FaqItem(
                      question: 'কে রক্ত দিতে পারেন?',
                      answer:
                          'সাধারণত ১৮-৬০ বছর বয়সী, সুস্থ এবং নির্ধারিত ওজনের ব্যক্তি রক্ত দিতে পারেন।',
                    ),
                    const SizedBox(height: 10),
                    const FaqItem(
                      question: 'নিরাপদ রক্তদানের নিয়ম',
                      answer:
                          'রক্তদানের আগে বিশ্রাম নিন, পরিষ্কার স্থানে রক্ত দিন, পরে পানি ও খাবার খান।',
                    ),
                    const SizedBox(height: 10),
                    const FaqItem(
                      question: 'কতদিন পর আবার রক্ত দেওয়া যায়?',
                      answer:
                          'সাধারণভাবে অন্তত ৩ মাস পর আবার রক্ত দেওয়া ভালো।',
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class HomeHeader extends StatelessWidget {
  const HomeHeader({
    super.key,
    required this.onFindTap,
    required this.onOrganizationTap,
  });

  final VoidCallback onFindTap;
  final VoidCallback onOrganizationTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [kRed, kRed2],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(
            kScreenPadding,
            10,
            kScreenPadding,
            18,
          ),
          child: Column(
            children: [
              const AppHeaderRow(),
              const SizedBox(height: 14),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.18),
                  ),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.16),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              '🩸 রক্তদান করুন',
                              style: poppins(
                                size: 10,
                                weight: FontWeight.w600,
                                color: Colors.white,
                              ),
                            ),
                          ),
                          const SizedBox(height: 10),
                          Text(
                            'আপনার এক ব্যাগ রক্ত,\nবাঁচাতে পারে একটি জীবন',
                            style: poppins(
                              size: 15,
                              weight: FontWeight.w700,
                              color: Colors.white,
                              height: 1.25,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Expanded(
                                child: SizedBox(
                                  height: 38,
                                  child: ElevatedButton(
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.white,
                                      foregroundColor: kRed,
                                      elevation: 0,
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 12),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                    ),
                                    onPressed: onFindTap,
                                    child: Text(
                                      'দাতা খুঁজুন →',
                                      style: poppins(
                                        size: 11,
                                        weight: FontWeight.w700,
                                        color: kRed,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              SizedBox(
                                height: 38,
                                child: OutlinedButton(
                                  style: OutlinedButton.styleFrom(
                                    foregroundColor: Colors.white,
                                    side: BorderSide(
                                      color: Colors.white.withValues(alpha: 0.28),
                                    ),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                  ),
                                  onPressed: onOrganizationTap,
                                  child: Text(
                                    'সংগঠন',
                                    style: poppins(
                                      size: 10,
                                      weight: FontWeight.w700,
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Container(
                      width: 72,
                      height: 72,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.15),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.water_drop_rounded,
                        color: Colors.white,
                        size: 36,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class AppHeaderRow extends StatelessWidget {
  const AppHeaderRow({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Icon(Icons.water_drop_rounded, color: Colors.white, size: 20),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'বেড়া রক্তদাতা',
                style: poppins(
                  size: 14,
                  weight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
              Text(
                'ইউনিট • পাবনা',
                style: poppins(
                  size: 9,
                  weight: FontWeight.w500,
                  color: Colors.white.withValues(alpha: 0.60),
                ),
              ),
            ],
          ),
        ),
        const HeaderIcon(icon: Icons.notifications_none_rounded),
        const SizedBox(width: 8),
        const HeaderIcon(icon: Icons.person_outline_rounded),
      ],
    );
  }
}

class HeaderIcon extends StatelessWidget {
  const HeaderIcon({super.key, required this.icon});
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 34,
      height: 34,
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.15),
        shape: BoxShape.circle,
      ),
      child: Icon(icon, color: Colors.white, size: 18),
    );
  }
}

class StatsStrip extends StatelessWidget {
  const StatsStrip({
    super.key,
    required this.totalUsers,
    required this.totalDonors,
    required this.totalRequests,
  });

  final int totalUsers;
  final int totalDonors;
  final int totalRequests;

  @override
  Widget build(BuildContext context) {
    return StyledCard(
      child: Row(
        children: [
          Expanded(
            child: _StatColumn(label: 'ব্যবহারকারী', value: '$totalUsers+'),
          ),
          const _VerticalDivider(),
          Expanded(
            child: _StatColumn(label: 'রক্তদাতা', value: '$totalDonors+'),
          ),
          const _VerticalDivider(),
          Expanded(
            child: _StatColumn(label: 'অনুরোধ', value: '$totalRequests+'),
          ),
        ],
      ),
    );
  }
}

class _StatColumn extends StatelessWidget {
  const _StatColumn({required this.label, required this.value});
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Column(
        children: [
          Text(
            value,
            style: poppins(
              size: 17,
              weight: FontWeight.w700,
              color: kRed,
            ),
          ),
          const SizedBox(height: 2),
          Text(label, style: labelStyle()),
        ],
      ),
    );
  }
}

class _VerticalDivider extends StatelessWidget {
  const _VerticalDivider();

  @override
  Widget build(BuildContext context) {
    return Container(width: 1, height: 28, color: kBorder);
  }
}

class QuickActionGrid extends StatelessWidget {
  const QuickActionGrid({super.key});

  @override
  Widget build(BuildContext context) {
    final items = [
      QuickActionData(
        label: 'দাতা খুঁজুন',
        icon: Icons.search_rounded,
        color: kRed,
        bg: kRedSoft,
        onTap: () => context.go('/donors'),
      ),
      QuickActionData(
        label: 'অনুরোধ দিন',
        icon: Icons.note_add_rounded,
        color: const Color(0xFF1976D2),
        bg: const Color(0xFFE3F2FD),
        onTap: () => context.push('/request/new'),
      ),
      QuickActionData(
        label: 'ব্লাড ব্যাংক',
        icon: Icons.local_hospital_rounded,
        color: kGreen,
        bg: kGreenSoft,
        onTap: () => context.push('/banks'),
      ),
      QuickActionData(
        label: 'ক্যাম্পেইন',
        icon: Icons.campaign_rounded,
        color: kOrange,
        bg: kOrangeSoft,
        onTap: () => context.go('/campaigns'),
      ),
    ];

    return Row(
      children: items
          .map(
            (item) => Expanded(
              child: GestureDetector(
                onTap: item.onTap,
                child: Column(
                  children: [
                    Container(
                      width: 46,
                      height: 46,
                      decoration: BoxDecoration(
                        color: item.bg,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(item.icon, color: item.color, size: 22),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      item.label,
                      textAlign: TextAlign.center,
                      style: poppins(
                        size: 9,
                        weight: FontWeight.w600,
                        color: kText2,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          )
          .toList(),
    );
  }
}

class QuickActionData {
  const QuickActionData({
    required this.label,
    required this.icon,
    required this.color,
    required this.bg,
    required this.onTap,
  });

  final String label;
  final IconData icon;
  final Color color;
  final Color bg;
  final VoidCallback onTap;
}

class UrgentBanner extends StatelessWidget {
  const UrgentBanner({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [Color(0xFFFFF5F5), kRedSoft]),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: kRedMid),
      ),
      child: Row(
        children: [
          Container(
            width: 4,
            height: 42,
            decoration: BoxDecoration(
              color: kRed,
              borderRadius: BorderRadius.circular(20),
            ),
          ),
          const SizedBox(width: 10),
          const PulseDot(),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'জরুরি রক্তের অনুরোধ চলছে',
                  style: poppins(size: 11, weight: FontWeight.w700, color: kRed),
                ),
                const SizedBox(height: 2),
                Text(
                  'ওপেন অনুরোধে দ্রুত সাড়া দিন এবং জীবন বাঁচাতে এগিয়ে আসুন।',
                  style: hind(size: 9, weight: FontWeight.w500, color: kText2),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class PulseDot extends StatefulWidget {
  const PulseDot({super.key});

  @override
  State<PulseDot> createState() => _PulseDotState();
}

class _PulseDotState extends State<PulseDot>
    with SingleTickerProviderStateMixin {
  late final AnimationController controller;

  @override
  void initState() {
    super.initState();
    controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (context, child) {
        final spread = 6 + (controller.value * 8);
        return Container(
          width: 9,
          height: 9,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: kRed,
            boxShadow: [
              BoxShadow(
                color: kRed.withValues(alpha: 0.28),
                blurRadius: spread,
                spreadRadius: controller.value * 2,
              ),
            ],
          ),
        );
      },
    );
  }
}

class SectionHeading extends StatelessWidget {
  const SectionHeading({
    super.key,
    required this.title,
    this.action,
    this.onTap,
  });

  final String title;
  final String? action;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Text(title, style: sectionTitleStyle()),
        const Spacer(),
        if (action != null && onTap != null)
          GestureDetector(
            onTap: onTap,
            child: Text(action!, style: labelStyle(color: kRed)),
          ),
      ],
    );
  }
}

class StyledCard extends StatelessWidget {
  const StyledCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(kCardPadding),
  });

  final Widget child;
  final EdgeInsets padding;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: kCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: kBorder),
        boxShadow: kCardShadow,
      ),
      child: child,
    );
  }
}

class DonorMiniCard extends StatelessWidget {
  const DonorMiniCard({super.key, required this.donor});
  final DonorItem donor;

  @override
  Widget build(BuildContext context) {
    return StyledCard(
      child: Row(
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: const BoxDecoration(
              color: kRed,
              shape: BoxShape.circle,
            ),
            alignment: Alignment.center,
            child: Text(
              donor.name.isEmpty ? 'র' : donor.name.characters.first.toUpperCase(),
              style: poppins(size: 14, weight: FontWeight.w700, color: Colors.white),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(donor.name, style: cardTitleStyle()),
                Text(donor.location, style: captionStyle()),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      decoration: const BoxDecoration(
                        color: kGreen,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      donor.availabilityText,
                      style: hind(size: 9, weight: FontWeight.w500, color: kGreen),
                    ),
                  ],
                ),
              ],
            ),
          ),
          BloodPill(group: donor.bloodGroup),
        ],
      ),
    );
  }
}

class BloodPill extends StatelessWidget {
  const BloodPill({super.key, required this.group});
  final String group;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
      decoration: BoxDecoration(
        color: kRedSoft,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        group,
        style: poppins(size: 11, weight: FontWeight.w700, color: kRed),
      ),
    );
  }
}

class BenefitsPanel extends StatelessWidget {
  const BenefitsPanel({super.key});

  @override
  Widget build(BuildContext context) {
    const items = [
      'হৃদরোগের ঝুঁকি কমাতে সহায়তা করে',
      'শরীরে নতুন রক্তকোষ তৈরিতে ভূমিকা রাখে',
      'নিয়মিত স্বাস্থ্য পরীক্ষার সুযোগ বাড়ায়',
      'মানসিক তৃপ্তি ও সামাজিক দায়বদ্ধতা জাগায়',
    ];
    return StyledCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'রক্তদানের উপকারিতা',
            style: poppins(size: 18, weight: FontWeight.w700, color: kRed),
          ),
          const SizedBox(height: 6),
          Text(
            'রক্তদান শরীর ও মনের জন্য ইতিবাচক। নিয়মিত রক্তদান জীবন বাঁচানোর পাশাপাশি নিজেকেও সচেতন রাখে।',
            style: bodyStyle(),
          ),
          const SizedBox(height: 12),
          ...items.map(
            (item) => Padding(
              padding: const EdgeInsets.only(bottom: 11),
              child: Row(
                children: [
                  Container(
                    width: 26,
                    height: 26,
                    decoration: BoxDecoration(
                      color: kRedSoft,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Icon(
                      Icons.check_rounded,
                      color: kRed,
                      size: 16,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(item, style: hind(size: 12, weight: FontWeight.w500, color: kText)),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class FaqItem extends StatelessWidget {
  const FaqItem({super.key, required this.question, required this.answer});

  final String question;
  final String answer;

  @override
  Widget build(BuildContext context) {
    return StyledCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(question, style: cardTitleStyle()),
          const SizedBox(height: 5),
          Text(answer, style: bodyStyle()),
        ],
      ),
    );
  }
}

class DonorsScreen extends StatefulWidget {
  const DonorsScreen({super.key, required this.repository});
  final AppRepository repository;

  @override
  State<DonorsScreen> createState() => _DonorsScreenState();
}

class _DonorsScreenState extends State<DonorsScreen> {
  String activeGroup = '';
  late Future<List<DonorItem>> donorsFuture;

  @override
  void initState() {
    super.initState();
    donorsFuture = widget.repository.fetchDonors();
  }

  void changeGroup(String value) {
    setState(() {
      activeGroup = activeGroup == value ? '' : value;
      donorsFuture = widget.repository.fetchDonors(bloodGroup: activeGroup);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBg,
      body: Column(
        children: [
          ScreenHeader(
            title: 'রক্তদাতা খোঁজা',
            headerChild: Container(
              margin: const EdgeInsets.only(top: 12),
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.20),
                ),
              ),
              child: TextField(
                style: hind(size: 12, color: Colors.white),
                decoration: InputDecoration(
                  hintText: 'রক্তের গ্রুপ দিয়ে খুঁজুন',
                  hintStyle: hind(
                    size: 12,
                    color: Colors.white.withValues(alpha: 0.50),
                  ),
                  border: InputBorder.none,
                  filled: false,
                ),
              ),
            ),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(
                kScreenPadding,
                12,
                kScreenPadding,
                18,
              ),
              children: [
                SizedBox(
                  height: 34,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemBuilder: (context, index) {
                      final group = _bloodGroups[index];
                      final active = activeGroup == group;
                      return FilterChipButton(
                        label: group,
                        active: active,
                        onTap: () => changeGroup(group),
                      );
                    },
                    separatorBuilder: (_, __) => const SizedBox(width: 8),
                    itemCount: _bloodGroups.length,
                  ),
                ),
                const SizedBox(height: kSectionGap),
                FutureBuilder<List<DonorItem>>(
                  future: donorsFuture,
                  builder: (context, snapshot) {
                    final donors = snapshot.data ?? DonorItem.demo;
                    if (donors.isEmpty) {
                      return const EmptyStateCard(
                        title: 'কোনো দাতা পাওয়া যায়নি',
                        subtitle: 'অন্য রক্তের গ্রুপ বেছে আবার খুঁজুন।',
                      );
                    }
                    return Column(
                      children: donors
                          .map(
                            (donor) => Padding(
                              padding: const EdgeInsets.only(bottom: kCardGap),
                              child: DonorFullCard(donor: donor),
                            ),
                          )
                          .toList(),
                    );
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class RequestsScreen extends StatefulWidget {
  const RequestsScreen({super.key, required this.repository});
  final AppRepository repository;

  @override
  State<RequestsScreen> createState() => _RequestsScreenState();
}

class _RequestsScreenState extends State<RequestsScreen> {
  String activeGroup = '';
  late Future<List<RequestItem>> requestsFuture;

  @override
  void initState() {
    super.initState();
    requestsFuture = widget.repository.fetchRequests();
  }

  void changeGroup(String value) {
    setState(() {
      activeGroup = activeGroup == value ? '' : value;
      requestsFuture = widget.repository.fetchRequests(bloodGroup: activeGroup);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBg,
      body: Column(
        children: [
          ScreenHeader(
            title: 'রক্তের অনুরোধ',
            action: SmallWhiteButton(
              text: 'নতুন',
              onTap: () => context.push('/request/new'),
            ),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(
                kScreenPadding,
                12,
                kScreenPadding,
                18,
              ),
              children: [
                SizedBox(
                  height: 34,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: _bloodGroups.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 8),
                    itemBuilder: (context, index) {
                      final group = _bloodGroups[index];
                      return FilterChipButton(
                        label: group,
                        active: activeGroup == group,
                        onTap: () => changeGroup(group),
                      );
                    },
                  ),
                ),
                const SizedBox(height: kSectionGap),
                FutureBuilder<List<RequestItem>>(
                  future: requestsFuture,
                  builder: (context, snapshot) {
                    final requests = snapshot.data ?? RequestItem.demo;
                    if (requests.isEmpty) {
                      return const EmptyStateCard(
                        title: 'কোনো অনুরোধ নেই',
                        subtitle: 'নতুন অনুরোধ দিলে এখানে দেখাবে।',
                      );
                    }
                    return Column(
                      children: requests
                          .map(
                            (item) => Padding(
                              padding: const EdgeInsets.only(bottom: kCardGap),
                              child: RequestCard(item: item),
                            ),
                          )
                          .toList(),
                    );
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class CampaignsScreen extends StatelessWidget {
  const CampaignsScreen({super.key, required this.repository});
  final AppRepository repository;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBg,
      body: Column(
        children: [
          const ScreenHeader(title: 'ক্যাম্পেইন'),
          Expanded(
            child: FutureBuilder<List<CampaignItem>>(
              future: repository.fetchCampaigns(),
              builder: (context, snapshot) {
                final items = snapshot.data ?? CampaignItem.demo;
                return ListView.separated(
                  padding: const EdgeInsets.fromLTRB(
                    kScreenPadding,
                    12,
                    kScreenPadding,
                    18,
                  ),
                  itemBuilder: (context, index) => CampaignCard(
                    item: items[index],
                    imagePath:
                        index.isEven ? 'assets/images/one.jpg' : 'assets/images/two.jpg',
                  ),
                  separatorBuilder: (_, __) => const SizedBox(height: kCardGap),
                  itemCount: items.length,
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class AccountScreen extends StatelessWidget {
  const AccountScreen({super.key, required this.repository});
  final AppRepository repository;

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<AuthState>(
      stream: repository.authChanges(),
      builder: (context, snapshot) {
        final user = repository.currentUser;
        if (user == null) {
          return AuthScreen(repository: repository);
        }
        return ProfileScreen(repository: repository);
      },
    );
  }
}

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key, required this.repository});
  final AppRepository repository;

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool loginMode = true;
  bool loading = false;
  List<OrganizationItem> organizations = [];
  String? organizationId = 'none';

  final nameController = TextEditingController();
  final phoneController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  @override
  void initState() {
    super.initState();
    widget.repository.fetchOrganizations().then((value) {
      if (mounted) setState(() => organizations = value);
    });
  }

  Future<void> submit() async {
    setState(() => loading = true);
    try {
      if (loginMode) {
        await widget.repository.signIn(
          emailController.text.trim(),
          passwordController.text.trim(),
        );
      } else {
        await widget.repository.signUp(
          fullName: nameController.text.trim(),
          phone: phoneController.text.trim(),
          email: emailController.text.trim(),
          password: passwordController.text.trim(),
          organizationId: organizationId == 'none' ? null : organizationId,
        );
      }
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(loginMode ? 'লগ ইন সফল' : 'নিবন্ধন সফল')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(e.toString())));
      }
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBg,
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              width: double.infinity,
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [kRed, kRed2],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: SafeArea(
                bottom: false,
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(
                    kScreenPadding,
                    18,
                    kScreenPadding,
                    28,
                  ),
                  child: Column(
                    children: [
                      Container(
                        width: 56,
                        height: 56,
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.18),
                          borderRadius: BorderRadius.circular(18),
                        ),
                        alignment: Alignment.center,
                        child: const Icon(
                          Icons.water_drop_rounded,
                          color: Colors.white,
                          size: 28,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'বেড়া রক্তদাতা',
                        style: poppins(size: 16, weight: FontWeight.w700, color: Colors.white),
                      ),
                      Text(
                        'ইউনিট • পাবনা',
                        style: poppins(
                          size: 10,
                          weight: FontWeight.w500,
                          color: Colors.white.withValues(alpha: 0.65),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            Transform.translate(
              offset: const Offset(0, -16),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: kScreenPadding),
                child: Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: kCardShadow,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('স্বাগতম 👋', style: poppins(size: 16, weight: FontWeight.w700)),
                      const SizedBox(height: 4),
                      Text(
                        loginMode
                            ? 'আপনার অ্যাকাউন্টে প্রবেশ করুন'
                            : 'নতুন অ্যাকাউন্ট খুলুন',
                        style: bodyStyle(),
                      ),
                      const SizedBox(height: 14),
                      if (!loginMode) ...[
                        FormLabel('পূর্ণ নাম'),
                        const SizedBox(height: 6),
                        TextField(controller: nameController),
                        const SizedBox(height: 10),
                        FormLabel('ফোন'),
                        const SizedBox(height: 6),
                        TextField(controller: phoneController),
                        const SizedBox(height: 10),
                      ],
                      FormLabel('ইমেইল'),
                      const SizedBox(height: 6),
                      TextField(controller: emailController),
                      const SizedBox(height: 10),
                      FormLabel('পাসওয়ার্ড'),
                      const SizedBox(height: 6),
                      TextField(controller: passwordController, obscureText: true),
                      if (!loginMode) ...[
                        const SizedBox(height: 10),
                        FormLabel('সংগঠন'),
                        const SizedBox(height: 6),
                        DropdownButtonFormField<String>(
                          initialValue: organizationId,
                          decoration: const InputDecoration(),
                          items: [
                            const DropdownMenuItem(
                              value: 'none',
                              child: Text('আমি কোনো সংগঠনের না'),
                            ),
                            ...organizations.map(
                              (org) => DropdownMenuItem(
                                value: org.id,
                                child: Text(org.name),
                              ),
                            ),
                          ],
                          onChanged: (value) => setState(() => organizationId = value),
                        ),
                      ],
                      const SizedBox(height: 16),
                      Container(
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(colors: [kRed2, kRed]),
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: kRedShadow,
                        ),
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.transparent,
                            foregroundColor: Colors.white,
                            shadowColor: Colors.transparent,
                            minimumSize: const Size.fromHeight(48),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          onPressed: loading ? null : submit,
                          child: Text(
                            loginMode ? 'লগ ইন' : 'নিবন্ধন করুন',
                            style: poppins(size: 12, weight: FontWeight.w700, color: Colors.white),
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          const Expanded(child: Divider(color: kBorder)),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 8),
                            child: Text('OR', style: labelStyle()),
                          ),
                          const Expanded(child: Divider(color: kBorder)),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Center(
                        child: TextButton(
                          onPressed: () => setState(() => loginMode = !loginMode),
                          child: Text(
                            loginMode
                                ? 'নতুন? নিবন্ধন করুন'
                                : 'অ্যাকাউন্ট আছে? লগ ইন',
                            style: poppins(size: 11, weight: FontWeight.w700, color: kRed),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class FormLabel extends StatelessWidget {
  const FormLabel(this.text, {super.key});
  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text.toUpperCase(),
      style: poppins(
        size: 10,
        weight: FontWeight.w700,
        color: kText2,
        letterSpacing: 0.6,
      ),
    );
  }
}

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key, required this.repository});
  final AppRepository repository;

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<ProfileBundle?>(
      future: repository.myProfile(),
      builder: (context, snapshot) {
        final profile = snapshot.data;
        final donor = profile?.donorRow;
        final name = (profile?.userRow['full_name'] ?? repository.currentUser?.email ?? 'ব্যবহারকারী').toString();
        final blood = (donor?['blood_group'] ?? 'B+').toString();
        final total = ((donor?['total_donations'] ?? 0) as num).toInt();
        return Scaffold(
          backgroundColor: kBg,
          body: ListView(
            padding: EdgeInsets.zero,
            children: [
              Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(colors: [kRed, kRed2]),
                ),
                child: SafeArea(
                  bottom: false,
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(
                      kScreenPadding,
                      16,
                      kScreenPadding,
                      18,
                    ),
                    child: Column(
                      children: [
                        Align(
                          alignment: Alignment.topRight,
                          child: HeaderIcon(
                            icon: Icons.logout_rounded,
                            key: const ValueKey('logout'),
                          ),
                        ),
                        Stack(
                          clipBehavior: Clip.none,
                          children: [
                            Container(
                              width: 68,
                              height: 68,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.white.withValues(alpha: 0.20),
                                border: Border.all(
                                  color: Colors.white.withValues(alpha: 0.40),
                                  width: 3,
                                ),
                              ),
                              alignment: Alignment.center,
                              child: Text(
                                name.isEmpty ? 'র' : name.characters.first.toUpperCase(),
                                style: poppins(size: 22, weight: FontWeight.w700, color: Colors.white),
                              ),
                            ),
                            Positioned(
                              right: -2,
                              bottom: -2,
                              child: GestureDetector(
                                onTap: () => context.push('/profile/edit'),
                                child: Container(
                                  width: 22,
                                  height: 22,
                                  decoration: const BoxDecoration(
                                    color: Colors.white,
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(Icons.edit_rounded, color: kRed, size: 12),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Text(
                          name,
                          textAlign: TextAlign.center,
                          style: poppins(size: 16, weight: FontWeight.w700, color: Colors.white),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          profile?.organization?.name ?? 'বেড়া • পাবনা',
                          style: poppins(
                            size: 10,
                            weight: FontWeight.w500,
                            color: Colors.white.withValues(alpha: 0.65),
                          ),
                        ),
                        const SizedBox(height: 10),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.18),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.18),
                            ),
                          ),
                          child: Text(
                            blood,
                            style: poppins(size: 11, weight: FontWeight.w700, color: Colors.white),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(
                  kScreenPadding,
                  12,
                  kScreenPadding,
                  18,
                ),
                child: Column(
                  children: [
                    StyledCard(
                      child: Row(
                        children: [
                          Expanded(
                            child: ProfileStatCell(label: 'রক্তদান', value: '$total'),
                          ),
                          const _VerticalDivider(),
                          Expanded(
                            child: ProfileStatCell(
                              label: 'অনুরোধ',
                              value: '${profile == null ? 0 : 1}',
                            ),
                          ),
                          const _VerticalDivider(),
                          Expanded(
                            child: ProfileStatCell(
                              label: 'সংগঠন',
                              value:
                                  '${profile?.organization == null ? 0 : profile!.organization!.memberCount}',
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: kSectionGap),
                    const GroupLabel('প্রোফাইল'),
                    const SizedBox(height: 8),
                    MenuCardItem(
                      icon: Icons.edit_outlined,
                      iconBg: kRedSoft,
                      iconColor: kRed,
                      title: 'প্রোফাইল আপডেট',
                      onTap: () => context.push('/profile/edit'),
                    ),
                    const SizedBox(height: 8),
                    MenuCardItem(
                      icon: Icons.groups_rounded,
                      iconBg: const Color(0xFFE3F2FD),
                      iconColor: const Color(0xFF1976D2),
                      title: 'সংগঠনসমূহ',
                      onTap: () => context.push('/organizations'),
                    ),
                    const SizedBox(height: kSectionGap),
                    const GroupLabel('ফিচার'),
                    const SizedBox(height: 8),
                    MenuCardItem(
                      icon: Icons.note_add_rounded,
                      iconBg: kOrangeSoft,
                      iconColor: kOrange,
                      title: 'রক্তের অনুরোধ দিন',
                      onTap: () => context.push('/request/new'),
                    ),
                    const SizedBox(height: 8),
                    MenuCardItem(
                      icon: Icons.local_hospital_rounded,
                      iconBg: kGreenSoft,
                      iconColor: kGreen,
                      title: 'ব্লাড ব্যাংক',
                      onTap: () => context.push('/banks'),
                    ),
                    const SizedBox(height: 8),
                    MenuCardItem(
                      icon: Icons.menu_book_rounded,
                      iconBg: kBg,
                      iconColor: kText2,
                      title: 'ব্লগ ও তথ্য',
                      onTap: () => context.push('/awareness'),
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton(
                        onPressed: () => repository.signOut(),
                        style: OutlinedButton.styleFrom(
                          minimumSize: const Size.fromHeight(46),
                          side: const BorderSide(color: kBorder),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: Text(
                          'লগ আউট',
                          style: poppins(size: 12, weight: FontWeight.w700, color: kText),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class ProfileStatCell extends StatelessWidget {
  const ProfileStatCell({super.key, required this.label, required this.value});
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value, style: poppins(size: 18, weight: FontWeight.w700, color: kRed)),
        const SizedBox(height: 2),
        Text(label, style: labelStyle()),
      ],
    );
  }
}

class GroupLabel extends StatelessWidget {
  const GroupLabel(this.label, {super.key});
  final String label;

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Text(
        label.toUpperCase(),
        style: poppins(
          size: 9,
          weight: FontWeight.w700,
          color: kText3,
          letterSpacing: 0.8,
        ),
      ),
    );
  }
}

class MenuCardItem extends StatelessWidget {
  const MenuCardItem({
    super.key,
    required this.icon,
    required this.iconBg,
    required this.iconColor,
    required this.title,
    required this.onTap,
  });

  final IconData icon;
  final Color iconBg;
  final Color iconColor;
  final String title;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: kCard,
          borderRadius: BorderRadius.circular(12),
          boxShadow: kCardShadow,
        ),
        child: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: iconBg,
                borderRadius: BorderRadius.circular(9),
              ),
              child: Icon(icon, color: iconColor, size: 18),
            ),
            const SizedBox(width: 10),
            Expanded(child: Text(title, style: cardTitleStyle())),
            const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: kText3),
          ],
        ),
      ),
    );
  }
}

class ScreenHeader extends StatelessWidget {
  const ScreenHeader({
    super.key,
    required this.title,
    this.headerChild,
    this.action,
  });

  final String title;
  final Widget? headerChild;
  final Widget? action;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(colors: [kRed, kRed2]),
      ),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(
            kScreenPadding,
            10,
            kScreenPadding,
            14,
          ),
          child: Column(
            children: [
              Row(
                children: [
                  const Expanded(child: AppHeaderRow()),
                  if (action != null) action!,
                ],
              ),
              const SizedBox(height: 12),
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  title,
                  style: pageTitleStyle(color: Colors.white),
                ),
              ),
              if (headerChild != null) headerChild!,
            ],
          ),
        ),
      ),
    );
  }
}

class SmallWhiteButton extends StatelessWidget {
  const SmallWhiteButton({super.key, required this.text, required this.onTap});
  final String text;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.16),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.white.withValues(alpha: 0.20)),
        ),
        child: Text(
          text,
          style: poppins(size: 10, weight: FontWeight.w700, color: Colors.white),
        ),
      ),
    );
  }
}

class FilterChipButton extends StatelessWidget {
  const FilterChipButton({
    super.key,
    required this.label,
    required this.active,
    required this.onTap,
  });

  final String label;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: active ? kRed : kBg,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: active ? kRed : kBorder),
        ),
        child: Text(
          label,
          style: poppins(
            size: 10,
            weight: FontWeight.w600,
            color: active ? Colors.white : kText2,
          ),
        ),
      ),
    );
  }
}

class DonorFullCard extends StatelessWidget {
  const DonorFullCard({super.key, required this.donor});
  final DonorItem donor;

  @override
  Widget build(BuildContext context) {
    return StyledCard(
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: kRedSoft,
                  shape: BoxShape.circle,
                ),
                alignment: Alignment.center,
                child: Text(
                  donor.name.isEmpty ? 'র' : donor.name.characters.first.toUpperCase(),
                  style: poppins(size: 16, weight: FontWeight.w700, color: kRed),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(donor.name, style: cardTitleStyle()),
                    const SizedBox(height: 3),
                    Text(donor.location, style: captionStyle()),
                    const SizedBox(height: 6),
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: [
                        StatusTag(
                          text: donor.eligible ? '✓ সময় হয়েছে' : '✓ সময় হয়নি',
                          bg: kGreenSoft,
                          color: kGreen,
                        ),
                        if (donor.verified)
                          const StatusTag(
                            text: '✓ ভেরিফাইড',
                            bg: Color(0xFFE3F2FD),
                            color: Color(0xFF1976D2),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: kRedSoft,
                  borderRadius: BorderRadius.circular(12),
                ),
                alignment: Alignment.center,
                child: Text(
                  donor.bloodGroup,
                  style: poppins(size: 18, weight: FontWeight.w800, color: kRed),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: kRed,
                foregroundColor: Colors.white,
                minimumSize: const Size.fromHeight(44),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
                elevation: 0,
                shadowColor: Colors.transparent,
              ),
              onPressed: () => callPhone(donor.phone, context),
              child: Text(
                '📞 কল করুন',
                style: poppins(size: 12, weight: FontWeight.w700, color: Colors.white),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class StatusTag extends StatelessWidget {
  const StatusTag({
    super.key,
    required this.text,
    required this.bg,
    required this.color,
  });

  final String text;
  final Color bg;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        text,
        style: poppins(size: 9, weight: FontWeight.w600, color: color),
      ),
    );
  }
}

class RequestCard extends StatelessWidget {
  const RequestCard({super.key, required this.item});
  final RequestItem item;

  @override
  Widget build(BuildContext context) {
    final urgency = urgencyMeta(item.urgency);
    return StyledCard(
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(item.patientName, style: cardTitleStyle()),
                      const SizedBox(height: 2),
                      Text(item.hospital, style: hind(size: 10, weight: FontWeight.w500, color: kText2)),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: urgency.bg,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    urgency.label,
                    style: poppins(size: 9, weight: FontWeight.w700, color: urgency.color),
                  ),
                ),
              ],
            ),
          ),
          Container(height: 1, color: kBorder),
          const SizedBox(height: 12),
          Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: kRedSoft,
                  borderRadius: BorderRadius.circular(14),
                ),
                alignment: Alignment.center,
                child: Text(
                  item.bloodGroup,
                  style: poppins(size: 18, weight: FontWeight.w800, color: kRed),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    MetaLine(icon: Icons.location_on_outlined, text: item.location),
                    const SizedBox(height: 4),
                    MetaLine(icon: Icons.calendar_today_rounded, text: formatDate(item.requiredDate)),
                    const SizedBox(height: 4),
                    MetaLine(icon: Icons.bloodtype_outlined, text: '${item.units} ব্যাগ'),
                  ],
                ),
              ),
              SizedBox(
                height: 34,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: kRed,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(9),
                    ),
                  ),
                  onPressed: () => callPhone(item.contactPhone, context),
                  child: Text(
                    'যোগাযোগ',
                    style: poppins(size: 10, weight: FontWeight.w700, color: Colors.white),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class UrgencyMeta {
  const UrgencyMeta(this.label, this.bg, this.color);
  final String label;
  final Color bg;
  final Color color;
}

UrgencyMeta urgencyMeta(String urgency) {
  final text = urgency.toLowerCase();
  if (text.contains('emergency')) {
    return const UrgencyMeta('Emergency', kRedSoft, kRed);
  }
  if (text.contains('urgent')) {
    return const UrgencyMeta('Urgent', kOrangeSoft, kOrange);
  }
  return const UrgencyMeta('Normal', kGreenSoft, kGreen);
}

class CampaignCard extends StatelessWidget {
  const CampaignCard({
    super.key,
    required this.item,
    required this.imagePath,
  });

  final CampaignItem item;
  final String imagePath;

  @override
  Widget build(BuildContext context) {
    final badge = campaignBadge(item.state);
    return StyledCard(
      padding: EdgeInsets.zero,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                child: Image.asset(
                  imagePath,
                  height: 90,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
              Positioned(
                top: 10,
                left: 10,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: badge.withValues(alpha: 0.85),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    item.state,
                    style: poppins(size: 9, weight: FontWeight.w700, color: Colors.white),
                  ),
                ),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.all(kCardPadding),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item.title, style: cardTitleStyle()),
                const SizedBox(height: 4),
                Text(item.location, style: hind(size: 10, weight: FontWeight.w500, color: kText2)),
                const SizedBox(height: 2),
                Text(formatDate(item.eventDate), style: captionStyle()),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

Color campaignBadge(String state) {
  switch (state) {
    case 'চলমান':
      return kOrange;
    case 'সম্পন্ন':
      return kGreen;
    default:
      return kRed;
  }
}

class AwarenessScreen extends StatelessWidget {
  const AwarenessScreen({super.key, required this.repository});
  final AppRepository repository;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBg,
      body: Column(
        children: [
          const ScreenHeader(title: 'ব্লগ ও তথ্য'),
          Expanded(
            child: FutureBuilder<List<AwarenessItem>>(
              future: repository.fetchAwareness(),
              builder: (context, snapshot) {
                final items = snapshot.data ?? AwarenessItem.demo;
                return ListView.separated(
                  padding: const EdgeInsets.fromLTRB(
                    kScreenPadding,
                    12,
                    kScreenPadding,
                    18,
                  ),
                  itemBuilder: (context, index) => AwarenessCard(item: items[index]),
                  separatorBuilder: (_, __) => const SizedBox(height: kCardGap),
                  itemCount: items.length,
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class AwarenessCard extends StatelessWidget {
  const AwarenessCard({super.key, required this.item});
  final AwarenessItem item;

  @override
  Widget build(BuildContext context) {
    return StyledCard(
      padding: EdgeInsets.zero,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 88,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFFFFF1F1), Color(0xFFFFF8F8)],
              ),
              borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
            ),
            alignment: Alignment.center,
            child: const Icon(Icons.favorite_rounded, color: kRed2, size: 34),
          ),
          Padding(
            padding: const EdgeInsets.all(kCardPadding),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item.title, style: cardTitleStyle()),
                const SizedBox(height: 6),
                Text(item.excerpt, style: bodyStyle()),
                const SizedBox(height: 6),
                Text('${item.author} • ${formatDate(item.date)}', style: captionStyle()),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class BloodBanksScreen extends StatelessWidget {
  const BloodBanksScreen({super.key, required this.repository});
  final AppRepository repository;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBg,
      body: Column(
        children: [
          const ScreenHeader(title: 'ব্লাড ব্যাংক'),
          Expanded(
            child: FutureBuilder<List<BloodBankItem>>(
              future: repository.fetchBloodBanks(),
              builder: (context, snapshot) {
                final items = snapshot.data ?? BloodBankItem.demo;
                if (items.isEmpty) {
                  return const Padding(
                    padding: EdgeInsets.all(kScreenPadding),
                    child: EmptyStateCard(
                      title: 'কোনো ব্লাড ব্যাংক নেই',
                      subtitle: 'পরে আবার দেখুন।',
                    ),
                  );
                }
                return ListView.separated(
                  padding: const EdgeInsets.fromLTRB(
                    kScreenPadding,
                    12,
                    kScreenPadding,
                    18,
                  ),
                  itemBuilder: (context, index) => StyledCard(
                    child: Row(
                      children: [
                        Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            color: kGreenSoft,
                            borderRadius: BorderRadius.circular(9),
                          ),
                          child: const Icon(
                            Icons.local_hospital_rounded,
                            color: kGreen,
                            size: 18,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(items[index].name, style: cardTitleStyle()),
                              const SizedBox(height: 3),
                              Text(items[index].address, style: bodyStyle()),
                            ],
                          ),
                        ),
                        TextButton(
                          onPressed: () => callPhone(items[index].phone, context),
                          child: Text(
                            'কল',
                            style: poppins(size: 10, weight: FontWeight.w700, color: kRed),
                          ),
                        ),
                      ],
                    ),
                  ),
                  separatorBuilder: (_, __) => const SizedBox(height: kCardGap),
                  itemCount: items.length,
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class OrganizationsScreen extends StatelessWidget {
  const OrganizationsScreen({super.key, required this.repository});
  final AppRepository repository;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBg,
      body: Column(
        children: [
          ScreenHeader(
            title: 'সংগঠনসমূহ',
            action: SmallWhiteButton(
              text: 'নতুন',
              onTap: () => context.push('/organizations/new'),
            ),
          ),
          Expanded(
            child: FutureBuilder<List<OrganizationItem>>(
              future: repository.fetchOrganizations(),
              builder: (context, snapshot) {
                final items = snapshot.data ?? OrganizationItem.demo;
                return ListView.separated(
                  padding: const EdgeInsets.fromLTRB(
                    kScreenPadding,
                    12,
                    kScreenPadding,
                    18,
                  ),
                  itemBuilder: (context, index) => OrganizationCard(
                    item: items[index],
                    onTap: () => context.push('/organizations/${items[index].slug}'),
                  ),
                  separatorBuilder: (_, __) => const SizedBox(height: kCardGap),
                  itemCount: items.length,
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class OrganizationCard extends StatelessWidget {
  const OrganizationCard({
    super.key,
    required this.item,
    this.onTap,
  });

  final OrganizationItem item;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: StyledCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(item.name, style: cardTitleStyle()),
            const SizedBox(height: 4),
            Text(item.description, style: bodyStyle()),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(child: Text(item.location, style: captionStyle())),
                Text(
                  '${item.memberCount} জন',
                  style: poppins(size: 10, weight: FontWeight.w700, color: kRed),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class OrganizationDetailsScreen extends StatelessWidget {
  const OrganizationDetailsScreen({
    super.key,
    required this.repository,
    required this.slug,
  });

  final AppRepository repository;
  final String slug;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBg,
      body: Column(
        children: [
          const ScreenHeader(title: 'সংগঠনের প্রোফাইল'),
          Expanded(
            child: FutureBuilder<List<OrganizationItem>>(
              future: repository.fetchOrganizations(),
              builder: (context, snapshot) {
                final orgs = snapshot.data ?? OrganizationItem.demo;
                final org = orgs.firstWhere(
                  (item) => item.slug == slug,
                  orElse: () => orgs.first,
                );
                return FutureBuilder<List<MemberItem>>(
                  future: repository.fetchOrganizationMembers(org.id),
                  builder: (context, memberSnapshot) {
                    final members = memberSnapshot.data ?? MemberItem.demo;
                    return ListView(
                      padding: const EdgeInsets.fromLTRB(
                        kScreenPadding,
                        12,
                        kScreenPadding,
                        18,
                      ),
                      children: [
                        OrganizationCard(item: org),
                        const SizedBox(height: kSectionGap),
                        SectionHeading(title: 'যারা যুক্ত হয়েছে'),
                        const SizedBox(height: 10),
                        ...members.map(
                          (member) => Padding(
                            padding: const EdgeInsets.only(bottom: kCardGap),
                            child: StyledCard(
                              child: Row(
                                children: [
                                  Container(
                                    width: 34,
                                    height: 34,
                                    decoration: BoxDecoration(
                                      color: kRedSoft,
                                      shape: BoxShape.circle,
                                    ),
                                    alignment: Alignment.center,
                                    child: Text(
                                      member.name.characters.first.toUpperCase(),
                                      style: poppins(size: 12, weight: FontWeight.w700, color: kRed),
                                    ),
                                  ),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(member.name, style: cardTitleStyle()),
                                        Text(member.bloodGroup, style: captionStyle()),
                                      ],
                                    ),
                                  ),
                                  TextButton(
                                    onPressed: () => callPhone(member.phone, context),
                                    child: Text(
                                      'কল',
                                      style: poppins(size: 10, weight: FontWeight.w700, color: kRed),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class CreateRequestScreen extends StatefulWidget {
  const CreateRequestScreen({super.key, required this.repository});
  final AppRepository repository;

  @override
  State<CreateRequestScreen> createState() => _CreateRequestScreenState();
}

class _CreateRequestScreenState extends State<CreateRequestScreen> {
  final patientController = TextEditingController();
  final hospitalController = TextEditingController();
  final locationController = TextEditingController();
  final contactController = TextEditingController();
  final phoneController = TextEditingController();
  final detailsController = TextEditingController();

  String bloodGroup = 'B+';
  String urgency = 'Emergency';

  Future<void> save() async {
    try {
      await widget.repository.createRequest({
        'patient_name': patientController.text.trim(),
        'blood_group': bloodGroup,
        'quantity_bags': 1,
        'required_date': DateTime.now().add(const Duration(days: 1)).toIso8601String(),
        'hospital_name': hospitalController.text.trim(),
        'division': locationController.text.trim(),
        'district': locationController.text.trim(),
        'upazila': locationController.text.trim(),
        'address': locationController.text.trim(),
        'contact_name': contactController.text.trim(),
        'contact_phone': phoneController.text.trim(),
        'urgency': urgency,
        'details': detailsController.text.trim(),
      });
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(const SnackBar(content: Text('অনুরোধ সেভ হয়েছে')));
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(e.toString())));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return FormShell(
      title: 'রক্তের অনুরোধ দিন',
      children: [
        FormLabel('রোগীর নাম'),
        const SizedBox(height: 6),
        TextField(controller: patientController),
        const SizedBox(height: 10),
        FormLabel('রক্তের গ্রুপ'),
        const SizedBox(height: 6),
        DropdownButtonFormField<String>(
          initialValue: bloodGroup,
          items: _bloodGroups
              .map((group) => DropdownMenuItem(value: group, child: Text(group)))
              .toList(),
          onChanged: (value) => setState(() => bloodGroup = value ?? 'B+'),
        ),
        const SizedBox(height: 10),
        FormLabel('হাসপাতাল'),
        const SizedBox(height: 6),
        TextField(controller: hospitalController),
        const SizedBox(height: 10),
        FormLabel('লোকেশন'),
        const SizedBox(height: 6),
        TextField(controller: locationController),
        const SizedBox(height: 10),
        FormLabel('যোগাযোগ ব্যক্তি'),
        const SizedBox(height: 6),
        TextField(controller: contactController),
        const SizedBox(height: 10),
        FormLabel('ফোন'),
        const SizedBox(height: 6),
        TextField(controller: phoneController),
        const SizedBox(height: 10),
        FormLabel('জরুরি স্তর'),
        const SizedBox(height: 6),
        DropdownButtonFormField<String>(
          initialValue: urgency,
          items: const ['Emergency', 'Urgent', 'Normal']
              .map((item) => DropdownMenuItem(value: item, child: Text(item)))
              .toList(),
          onChanged: (value) => setState(() => urgency = value ?? 'Emergency'),
        ),
        const SizedBox(height: 10),
        FormLabel('অতিরিক্ত তথ্য'),
        const SizedBox(height: 6),
        TextField(controller: detailsController, maxLines: 4),
        const SizedBox(height: 16),
        RedButton(text: 'সেভ করুন', onTap: save),
      ],
    );
  }
}

class CreateOrganizationScreen extends StatefulWidget {
  const CreateOrganizationScreen({super.key, required this.repository});
  final AppRepository repository;

  @override
  State<CreateOrganizationScreen> createState() => _CreateOrganizationScreenState();
}

class _CreateOrganizationScreenState extends State<CreateOrganizationScreen> {
  final nameController = TextEditingController();
  final slugController = TextEditingController();
  final descriptionController = TextEditingController();
  final divisionController = TextEditingController();
  final districtController = TextEditingController();
  final upazilaController = TextEditingController();
  final phoneController = TextEditingController();
  final emailController = TextEditingController();

  Future<void> save() async {
    try {
      await widget.repository.createOrganization({
        'name': nameController.text.trim(),
        'slug': slugController.text.trim(),
        'description': descriptionController.text.trim(),
        'division': divisionController.text.trim(),
        'district': districtController.text.trim(),
        'upazila': upazilaController.text.trim(),
        'contact_phone': phoneController.text.trim(),
        'contact_email': emailController.text.trim(),
      });
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(const SnackBar(content: Text('সংগঠন সেভ হয়েছে')));
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(e.toString())));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return FormShell(
      title: 'সংগঠন হিসাবে যুক্ত হোন',
      children: [
        FormLabel('সংগঠনের নাম'),
        const SizedBox(height: 6),
        TextField(controller: nameController),
        const SizedBox(height: 10),
        FormLabel('স্লাগ'),
        const SizedBox(height: 6),
        TextField(controller: slugController),
        const SizedBox(height: 10),
        FormLabel('বর্ণনা'),
        const SizedBox(height: 6),
        TextField(controller: descriptionController, maxLines: 4),
        const SizedBox(height: 10),
        FormLabel('বিভাগ'),
        const SizedBox(height: 6),
        TextField(controller: divisionController),
        const SizedBox(height: 10),
        FormLabel('জেলা'),
        const SizedBox(height: 6),
        TextField(controller: districtController),
        const SizedBox(height: 10),
        FormLabel('উপজেলা'),
        const SizedBox(height: 6),
        TextField(controller: upazilaController),
        const SizedBox(height: 10),
        FormLabel('ফোন'),
        const SizedBox(height: 6),
        TextField(controller: phoneController),
        const SizedBox(height: 10),
        FormLabel('ইমেইল'),
        const SizedBox(height: 6),
        TextField(controller: emailController),
        const SizedBox(height: 16),
        RedButton(text: 'সেভ করুন', onTap: save),
      ],
    );
  }
}

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key, required this.repository});
  final AppRepository repository;

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final nameController = TextEditingController();
  final phoneController = TextEditingController();
  final divisionController = TextEditingController();
  final districtController = TextEditingController();
  final upazilaController = TextEditingController();
  final addressController = TextEditingController();
  String bloodGroup = 'B+';

  Future<void> save() async {
    try {
      await widget.repository.saveDonorProfile({
        'full_name': nameController.text.trim(),
        'phone': phoneController.text.trim(),
        'blood_group': bloodGroup,
        'gender': 'male',
        'division': divisionController.text.trim(),
        'district': districtController.text.trim(),
        'upazila': upazilaController.text.trim(),
        'address': addressController.text.trim(),
        'total_donations': 0,
        'availability_status': 'available',
        'can_donate_urgently': true,
      });
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(const SnackBar(content: Text('প্রোফাইল সেভ হয়েছে')));
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(e.toString())));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return FormShell(
      title: 'প্রোফাইল আপডেট',
      children: [
        FormLabel('পূর্ণ নাম'),
        const SizedBox(height: 6),
        TextField(controller: nameController),
        const SizedBox(height: 10),
        FormLabel('ফোন'),
        const SizedBox(height: 6),
        TextField(controller: phoneController),
        const SizedBox(height: 10),
        FormLabel('রক্তের গ্রুপ'),
        const SizedBox(height: 6),
        DropdownButtonFormField<String>(
          initialValue: bloodGroup,
          items: _bloodGroups
              .map((group) => DropdownMenuItem(value: group, child: Text(group)))
              .toList(),
          onChanged: (value) => setState(() => bloodGroup = value ?? 'B+'),
        ),
        const SizedBox(height: 10),
        FormLabel('বিভাগ'),
        const SizedBox(height: 6),
        TextField(controller: divisionController),
        const SizedBox(height: 10),
        FormLabel('জেলা'),
        const SizedBox(height: 6),
        TextField(controller: districtController),
        const SizedBox(height: 10),
        FormLabel('উপজেলা'),
        const SizedBox(height: 6),
        TextField(controller: upazilaController),
        const SizedBox(height: 10),
        FormLabel('ঠিকানা'),
        const SizedBox(height: 6),
        TextField(controller: addressController, maxLines: 3),
        const SizedBox(height: 16),
        RedButton(text: 'সেভ করুন', onTap: save),
      ],
    );
  }
}

class FormShell extends StatelessWidget {
  const FormShell({
    super.key,
    required this.title,
    required this.children,
  });

  final String title;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBg,
      body: Column(
        children: [
          ScreenHeader(title: title),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(
                kScreenPadding,
                12,
                kScreenPadding,
                18,
              ),
              children: [
                StyledCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: children,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class RedButton extends StatelessWidget {
  const RedButton({super.key, required this.text, required this.onTap});
  final String text;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [kRed2, kRed]),
        borderRadius: BorderRadius.circular(12),
        boxShadow: kRedShadow,
      ),
      child: ElevatedButton(
        onPressed: onTap,
        style: ElevatedButton.styleFrom(
          minimumSize: const Size.fromHeight(48),
          shadowColor: Colors.transparent,
          backgroundColor: Colors.transparent,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
        child: Text(
          text,
          style: poppins(size: 12, weight: FontWeight.w700, color: Colors.white),
        ),
      ),
    );
  }
}

class MetaLine extends StatelessWidget {
  const MetaLine({super.key, required this.icon, required this.text});
  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 13, color: kText3),
        const SizedBox(width: 5),
        Expanded(child: Text(text, style: hind(size: 10, weight: FontWeight.w500, color: kText2))),
      ],
    );
  }
}

class EmptyStateCard extends StatelessWidget {
  const EmptyStateCard({
    super.key,
    required this.title,
    required this.subtitle,
  });

  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return StyledCard(
      child: Column(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: kRedSoft,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.inbox_outlined, color: kRed),
          ),
          const SizedBox(height: 10),
          Text(title, style: cardTitleStyle()),
          const SizedBox(height: 4),
          Text(subtitle, textAlign: TextAlign.center, style: bodyStyle()),
        ],
      ),
    );
  }
}

Future<void> callPhone(String phone, BuildContext context) async {
  final uri = Uri.parse('tel:$phone');
  final opened = await launchUrl(uri);
  if (!opened && context.mounted) {
    ScaffoldMessenger.of(context)
        .showSnackBar(const SnackBar(content: Text('কল করা যায়নি')));
  }
}

String formatDate(String raw) {
  final parsed = DateTime.tryParse(raw);
  if (parsed == null) return raw;
  return DateFormat('d MMM yyyy').format(parsed);
}
