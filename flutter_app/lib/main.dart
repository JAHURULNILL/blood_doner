import 'dart:async';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

const _bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  if (AppEnv.isConfigured) {
    await Supabase.initialize(
      url: AppEnv.supabaseUrl,
      anonKey: AppEnv.supabaseAnonKey,
    );
  }

  runApp(const BeraApp());
}

class AppEnv {
  static const supabaseUrl = String.fromEnvironment('SUPABASE_URL', defaultValue: '');
  static const supabaseAnonKey = String.fromEnvironment('SUPABASE_ANON_KEY', defaultValue: '');

  static bool get isConfigured => supabaseUrl.isNotEmpty && supabaseAnonKey.isNotEmpty;
}

class BeraApp extends StatefulWidget {
  const BeraApp({super.key});

  @override
  State<BeraApp> createState() => _BeraAppState();
}

class _BeraAppState extends State<BeraApp> {
  late final AppRepository repository;
  late final GoRouter router;

  @override
  void initState() {
    super.initState();
    repository = AppRepository();
    router = GoRouter(
      routes: [
        StatefulShellRoute.indexedStack(
          builder: (context, state, navigationShell) =>
              AppScaffold(navigationShell: navigationShell, repository: repository),
          branches: [
            StatefulShellBranch(routes: [
              GoRoute(path: '/', builder: (context, state) => HomePage(repository: repository)),
            ]),
            StatefulShellBranch(routes: [
              GoRoute(path: '/donors', builder: (context, state) => DonorsPage(repository: repository)),
            ]),
            StatefulShellBranch(routes: [
              GoRoute(path: '/requests', builder: (context, state) => RequestsPage(repository: repository)),
            ]),
            StatefulShellBranch(routes: [
              GoRoute(path: '/campaigns', builder: (context, state) => CampaignsPage(repository: repository)),
            ]),
            StatefulShellBranch(routes: [
              GoRoute(path: '/account', builder: (context, state) => AccountPage(repository: repository)),
            ]),
          ],
        ),
        GoRoute(path: '/request/new', builder: (context, state) => CreateRequestPage(repository: repository)),
        GoRoute(path: '/organization/new', builder: (context, state) => CreateOrganizationPage(repository: repository)),
        GoRoute(path: '/organizations', builder: (context, state) => OrganizationsPage(repository: repository)),
        GoRoute(
          path: '/organizations/:slug',
          builder: (context, state) => OrganizationDetailsPage(
            repository: repository,
            slug: state.pathParameters['slug']!,
          ),
        ),
        GoRoute(path: '/awareness', builder: (context, state) => AwarenessPage(repository: repository)),
        GoRoute(path: '/banks', builder: (context, state) => BloodBanksPage(repository: repository)),
        GoRoute(path: '/profile/edit', builder: (context, state) => EditProfilePage(repository: repository)),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      title: 'Bera Raktodata Unit',
      theme: AppTheme.theme,
      routerConfig: router,
    );
  }
}

class AppTheme {
  static ThemeData get theme {
    const blood = Color(0xFFC8382A);
    const ink = Color(0xFF131A24);
    const soft = Color(0xFFF7F3F1);

    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: const Color(0xFFF5F5F3),
      colorScheme: ColorScheme.fromSeed(
        seedColor: blood,
        primary: blood,
        surface: Colors.white,
      ),
      textTheme: const TextTheme(
        headlineLarge: TextStyle(fontSize: 34, fontWeight: FontWeight.w900, color: ink, height: 1.05),
        headlineMedium: TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: ink),
        headlineSmall: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: ink),
        titleLarge: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: ink),
        titleMedium: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: ink),
        bodyLarge: TextStyle(fontSize: 15, color: Color(0xFF465162), height: 1.45),
        bodyMedium: TextStyle(fontSize: 14, color: Color(0xFF5A6474), height: 1.45),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: blood,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white),
      ),
      cardTheme: CardThemeData(
        color: Colors.white,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(28),
          side: const BorderSide(color: Color(0xFFF0E7E3)),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: soft,
        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(22),
          borderSide: const BorderSide(color: Color(0xFFE8DFDA)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(22),
          borderSide: const BorderSide(color: Color(0xFFE8DFDA)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(22),
          borderSide: const BorderSide(color: blood, width: 1.3),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: blood,
          foregroundColor: Colors.white,
          minimumSize: const Size.fromHeight(56),
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
          textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}

class AppScaffold extends StatelessWidget {
  const AppScaffold({
    super.key,
    required this.navigationShell,
    required this.repository,
  });

  final StatefulNavigationShell navigationShell;
  final AppRepository repository;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: DecoratedBox(
        decoration: const BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(color: Color(0x14000000), blurRadius: 24, offset: Offset(0, -8)),
          ],
        ),
        child: SafeArea(
          top: false,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(14, 10, 14, 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _NavItem(icon: Icons.home_rounded, label: 'হোম', active: navigationShell.currentIndex == 0, onTap: () => navigationShell.goBranch(0)),
                _NavItem(icon: Icons.search_rounded, label: 'দাতা', active: navigationShell.currentIndex == 1, onTap: () => navigationShell.goBranch(1)),
                _CenterDrop(onTap: () => navigationShell.goBranch(2), active: navigationShell.currentIndex == 2),
                _NavItem(icon: Icons.campaign_rounded, label: 'ক্যাম্পেইন', active: navigationShell.currentIndex == 3, onTap: () => navigationShell.goBranch(3)),
                _NavItem(icon: Icons.person_rounded, label: 'আমার', active: navigationShell.currentIndex == 4, onTap: () => navigationShell.goBranch(4)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  const _NavItem({required this.icon, required this.label, required this.active, required this.onTap});

  final IconData icon;
  final String label;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final color = active ? const Color(0xFFC8382A) : const Color(0xFF9CA6B6);
    return InkWell(
      borderRadius: BorderRadius.circular(18),
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: color),
            const SizedBox(height: 4),
            Text(label, style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.w700)),
          ],
        ),
      ),
    );
  }
}

class _CenterDrop extends StatelessWidget {
  const _CenterDrop({required this.onTap, required this.active});

  final VoidCallback onTap;
  final bool active;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 62,
        height: 62,
        decoration: BoxDecoration(
          color: const Color(0xFFC8382A),
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(color: const Color(0xFFC8382A).withValues(alpha: 0.28), blurRadius: 22, offset: const Offset(0, 10)),
          ],
        ),
        child: Icon(Icons.water_drop_rounded, color: active ? Colors.white : Colors.white70, size: 28),
      ),
    );
  }
}

class AppRepository {
  SupabaseClient? get _client => AppEnv.isConfigured ? Supabase.instance.client : null;

  Stream<AuthState> authChanges() {
    if (_client == null) {
      return const Stream.empty();
    }
    return _client!.auth.onAuthStateChange;
  }

  User? get currentUser => _client?.auth.currentUser;

  Future<HomeBundle> getHomeBundle() async {
    final client = _client;
    if (client == null) return HomeBundle.demo();

    final donors = await fetchDonors();
    final requests = await fetchRequests();
    final campaigns = await fetchCampaigns();
    final awareness = await fetchAwareness();
    final organizations = await fetchOrganizations();
    return HomeBundle(
      donors: donors.take(4).toList(),
      requests: requests.take(4).toList(),
      campaigns: campaigns.take(3).toList(),
      awareness: awareness.take(3).toList(),
      organizations: organizations.take(6).toList(),
      totalUsers: await _count('users'),
      totalDonors: await _count('donor_profiles'),
      activeRequests: await _count('blood_requests', filters: {'status': 'Open'}),
    );
  }

  Future<int> _count(String table, {Map<String, dynamic>? filters}) async {
    final client = _client;
    if (client == null) return 0;
    var query = client.from(table).count();
    filters?.forEach((key, value) {
      query = query.eq(key, value);
    });
    return await query;
  }

  Future<List<DonorItem>> fetchDonors({String? bloodGroup}) async {
    final client = _client;
    if (client == null) return DonorItem.demo;

    dynamic query = client.from('donor_profiles').select('*, users(organization_id, full_name)').order('updated_at', ascending: false);
    if (bloodGroup != null && bloodGroup.isNotEmpty) {
      query = query.eq('blood_group', bloodGroup);
    }
    final data = await query;
    return (data as List<dynamic>).map(DonorItem.fromMap).toList();
  }

  Future<List<RequestItem>> fetchRequests({String? bloodGroup}) async {
    final client = _client;
    if (client == null) return RequestItem.demo;

    dynamic query = client.from('blood_requests').select('*').order('created_at', ascending: false);
    if (bloodGroup != null && bloodGroup.isNotEmpty) {
      query = query.eq('blood_group', bloodGroup);
    }
    final data = await query;
    return (data as List<dynamic>).map(RequestItem.fromMap).toList();
  }

  Future<List<CampaignItem>> fetchCampaigns() async {
    final client = _client;
    if (client == null) return CampaignItem.demo;
    final data = await client.from('campaigns').select('*').order('event_date');
    return (data as List<dynamic>).map(CampaignItem.fromMap).toList();
  }

  Future<List<AwarenessItem>> fetchAwareness() async {
    final client = _client;
    if (client == null) return AwarenessItem.demo;
    final data = await client.from('blogs').select('*').order('published_at', ascending: false);
    return (data as List<dynamic>).map(AwarenessItem.fromMap).toList();
  }

  Future<List<BloodBankItem>> fetchBloodBanks() async {
    final client = _client;
    if (client == null) return BloodBankItem.demo;
    final data = await client.from('blood_banks').select('*').order('name');
    return (data as List<dynamic>).map(BloodBankItem.fromMap).toList();
  }

  Future<List<OrganizationItem>> fetchOrganizations() async {
    final client = _client;
    if (client == null) return OrganizationItem.demo;
    final orgData = await client.from('organizations').select('*').order('name');
    final userData = await client.from('users').select('organization_id');

    final counts = <String, int>{};
    for (final row in userData as List<dynamic>) {
      final orgId = row['organization_id']?.toString();
      if (orgId == null || orgId.isEmpty) continue;
      counts[orgId] = (counts[orgId] ?? 0) + 1;
    }

    return (orgData as List<dynamic>)
        .map((e) => OrganizationItem.fromMap(e, counts[e['id']] ?? 0))
        .toList();
  }

  Future<List<MemberItem>> fetchOrganizationMembers(String organizationId) async {
    final client = _client;
    if (client == null) return MemberItem.demo;

    final users = await client.from('users').select('*').eq('organization_id', organizationId);
    final userIds = (users as List<dynamic>).map((e) => e['id'].toString()).toList();

    List<dynamic> donorProfiles = [];
    if (userIds.isNotEmpty) {
      donorProfiles = await client.from('donor_profiles').select('*').inFilter('user_id', userIds);
    }

    final donorMap = {for (final item in donorProfiles) item['user_id'].toString(): item};
    return (users)
        .map((e) => MemberItem.fromMap(e, donorMap[e['id'].toString()] as Map<String, dynamic>?))
        .toList();
  }

  Future<ProfileBundle?> fetchMyProfile() async {
    final client = _client;
    final user = currentUser;
    if (client == null || user == null) return null;

    final userRow = await client.from('users').select('*').eq('id', user.id).maybeSingle();
    final donor = await client.from('donor_profiles').select('*').eq('user_id', user.id).maybeSingle();
    OrganizationItem? organization;

    final organizationId = userRow?['organization_id']?.toString();
    if (organizationId != null && organizationId.isNotEmpty) {
      final org = await client.from('organizations').select('*').eq('id', organizationId).maybeSingle();
      if (org != null) {
        organization = OrganizationItem.fromMap(org, 0);
      }
    }

    return ProfileBundle(
      userRow: Map<String, dynamic>.from(userRow ?? {}),
      donorRow: donor == null ? null : Map<String, dynamic>.from(donor),
      organization: organization,
    );
  }

  Future<AuthResponse> signIn(String email, String password) async {
    final client = _client;
    if (client == null) throw Exception('Supabase config missing');
    return client.auth.signInWithPassword(email: email, password: password);
  }

  Future<AuthResponse> signUp({
    required String fullName,
    required String email,
    required String phone,
    required String password,
    String? organizationId,
  }) async {
    final client = _client;
    if (client == null) throw Exception('Supabase config missing');
    return client.auth.signUp(
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
    final client = _client;
    if (client == null) return;
    await client.auth.signOut();
  }

  Future<void> saveDonorProfile(Map<String, dynamic> payload) async {
    final client = _client;
    final user = currentUser;
    if (client == null || user == null) throw Exception('Login required');
    await client.from('donor_profiles').upsert({
      ...payload,
      'user_id': user.id,
      'email': user.email,
      'updated_at': DateTime.now().toIso8601String(),
    });
  }

  Future<void> createBloodRequest(Map<String, dynamic> payload) async {
    final client = _client;
    final user = currentUser;
    if (client == null || user == null) throw Exception('Login required');
    await client.from('blood_requests').insert({
      ...payload,
      'created_by': user.id,
      'status': 'Open',
    });
  }

  Future<void> createOrganization(Map<String, dynamic> payload) async {
    final client = _client;
    final user = currentUser;
    if (client == null || user == null) throw Exception('Login required');
    await client.from('organizations').insert({
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
    required this.activeRequests,
  });

  final List<DonorItem> donors;
  final List<RequestItem> requests;
  final List<CampaignItem> campaigns;
  final List<AwarenessItem> awareness;
  final List<OrganizationItem> organizations;
  final int totalUsers;
  final int totalDonors;
  final int activeRequests;

  factory HomeBundle.demo() => HomeBundle(
        donors: DonorItem.demo,
        requests: RequestItem.demo,
        campaigns: CampaignItem.demo,
        awareness: AwarenessItem.demo,
        organizations: OrganizationItem.demo,
        totalUsers: 462,
        totalDonors: 201,
        activeRequests: 47,
      );
}

class ProfileBundle {
  ProfileBundle({required this.userRow, required this.donorRow, required this.organization});

  final Map<String, dynamic> userRow;
  final Map<String, dynamic>? donorRow;
  final OrganizationItem? organization;
}

class DonorItem {
  DonorItem({
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
    final date = DateTime.tryParse(lastDonation!);
    if (date == null) return true;
    return DateTime.now().difference(date).inDays >= 90;
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
      totalDonation: (map['total_donations'] ?? 0) as int,
      verified: map['is_verified'] == true,
    );
  }

  static final demo = [
    DonorItem(id: '1', name: 'Md Jahurul Haque', phone: '01799298672', bloodGroup: 'B+', location: 'সুজানগর, পাবনা', lastDonation: '2025-11-04', totalDonation: 4, verified: true),
    DonorItem(id: '2', name: 'Md Abu Bokkar', phone: '01700000000', bloodGroup: 'B+', location: 'বেড়া, পাবনা', lastDonation: '2026-01-20', totalDonation: 2, verified: true),
  ];
}

class RequestItem {
  RequestItem({
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
      units: (map['quantity_bags'] ?? 0) as int,
      contactPhone: (map['contact_phone'] ?? '').toString(),
      urgency: (map['urgency'] ?? '').toString(),
      requiredDate: (map['required_date'] ?? '').toString(),
      status: (map['status'] ?? '').toString(),
    );
  }

  static final demo = [
    RequestItem(id: '1', patientName: 'রায়হান', bloodGroup: 'O+', hospital: 'বেড়া উপজেলা স্বাস্থ্য কমপ্লেক্স', location: 'বেড়া, পাবনা', units: 2, contactPhone: '01711111111', urgency: 'Emergency', requiredDate: '2026-04-22', status: 'Open'),
    RequestItem(id: '2', patientName: 'শাওন', bloodGroup: 'B+', hospital: 'ঢাকা মেডিকেল', location: 'ঢাকা', units: 1, contactPhone: '01722222222', urgency: 'Urgent', requiredDate: '2026-04-24', status: 'Open'),
  ];
}

class CampaignItem {
  CampaignItem({
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

  static final demo = [
    CampaignItem(id: '1', title: 'ফ্রি মেডিকেল ক্যাম্প', summary: 'বেড়া রক্তদাতা ইউনিটের ফ্রি মেডিকেল ক্যাম্প', location: 'বেড়া উপজেলা', eventDate: '2026-04-25', organizer: 'বেড়া রক্তদাতা ইউনিট'),
  ];
}

class AwarenessItem {
  AwarenessItem({
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

  static final demo = [
    AwarenessItem(id: '1', title: 'রক্তদানের আগে ও পরে কী করবেন?', excerpt: 'রক্তদানের আগে বিশ্রাম নিন, পানি পান করুন, রক্তদানের পরে হালকা খাবার খান।', author: 'ডা. তানভীর', date: '2026-04-08'),
    AwarenessItem(id: '2', title: 'কারা রক্ত দিতে পারবেন না?', excerpt: 'কম ওজন, অসুস্থতা বা কিছু বিশেষ ওষুধ চললে সাময়িকভাবে রক্ত না দেওয়াই ভালো।', author: 'বেড়া রক্তদাতা ইউনিট', date: '2026-04-10'),
  ];
}

class BloodBankItem {
  BloodBankItem({
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

  static final demo = [
    BloodBankItem(id: '1', name: 'বেড়া উপজেলা স্বাস্থ্য কমপ্লেক্স', type: 'hospital', address: 'বেড়া, পাবনা', phone: '01733333333', verified: true),
  ];
}

class OrganizationItem {
  OrganizationItem({
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

  static final demo = [
    OrganizationItem(id: '1', name: 'বেড়া রক্তদাতা ইউনিট', slug: 'bera-raktodata-unit', description: 'বেড়াভিত্তিক স্বেচ্ছাসেবী রক্তদাতা সংগঠন।', location: 'বেড়া, পাবনা', phone: '01744444444', memberCount: 18),
  ];
}

class MemberItem {
  MemberItem({
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

  static final demo = [
    MemberItem(id: '1', name: 'Md Jahurul Haque', phone: '01799298672', bloodGroup: 'B+'),
  ];
}

class HomePage extends StatelessWidget {
  const HomePage({super.key, required this.repository});
  final AppRepository repository;

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<HomeBundle>(
      future: repository.getHomeBundle(),
      builder: (context, snapshot) {
        final bundle = snapshot.data ?? HomeBundle.demo();
        return Scaffold(
          appBar: AppBar(
            title: const BrandTitle(),
          ),
          body: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('আপনার এক ব্যাগ রক্ত,\nবাঁচাতে পারে একটি জীবন', style: Theme.of(context).textTheme.headlineLarge),
                      const SizedBox(height: 14),
                      Text('প্রয়োজন হলে দ্রুত রক্তদাতা খুঁজুন, অনুরোধ দিন, সংগঠন হিসেবে যুক্ত হোন।', style: Theme.of(context).textTheme.bodyLarge),
                      const SizedBox(height: 18),
                      Row(
                        children: [
                          Expanded(
                            child: ElevatedButton(
                              onPressed: () => context.go('/donors'),
                              child: const Text('রক্তদাতা খুঁজুন'),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () => context.push('/organization/new'),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: const Color(0xFFC8382A),
                                minimumSize: const Size.fromHeight(56),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
                                side: const BorderSide(color: Color(0xFFC8382A)),
                              ),
                              child: const Text('সংগঠন হিসাবে যুক্ত হোন'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(child: _StatCard(label: 'ব্যবহারকারী', value: '${bundle.totalUsers}+')),
                  const SizedBox(width: 12),
                  Expanded(child: _StatCard(label: 'রক্তদাতা', value: '${bundle.totalDonors}+')),
                  const SizedBox(width: 12),
                  Expanded(child: _StatCard(label: 'অনুরোধ', value: '${bundle.activeRequests}+')),
                ],
              ),
              const SizedBox(height: 16),
              const BenefitsCard(),
              const SizedBox(height: 18),
              _SectionHeader(title: 'চলমান ক্যাম্পেইন', action: 'সব দেখুন', onTap: () => context.go('/campaigns')),
              const SizedBox(height: 10),
              ...bundle.campaigns.map((item) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: CampaignCard(item: item),
                  )),
              const SizedBox(height: 8),
              _SectionHeader(title: 'সচেতনতা', action: 'সব দেখুন', onTap: () => context.push('/awareness')),
              const SizedBox(height: 10),
              ...bundle.awareness.map((item) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: AwarenessCard(item: item),
                  )),
              const SizedBox(height: 8),
              _SectionHeader(title: 'সংগঠন', action: 'সব দেখুন', onTap: () => context.push('/organizations')),
              const SizedBox(height: 10),
              ...bundle.organizations.map((item) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: OrganizationCard(item: item, onTap: () => context.push('/organizations/${item.slug}')),
                  )),
              const SizedBox(height: 18),
              Text('সাধারণ জিজ্ঞাসাবলি', style: Theme.of(context).textTheme.headlineSmall),
              const SizedBox(height: 12),
              const FaqCard(question: 'কে রক্ত দিতে পারেন?', answer: 'সাধারণত ১৮-৬০ বছর বয়সী, সুস্থ এবং নির্ধারিত ওজনের ব্যক্তি রক্ত দিতে পারেন।'),
              const SizedBox(height: 10),
              const FaqCard(question: 'নিরাপদ রক্তদানের নিয়ম', answer: 'রক্তদানের আগে বিশ্রাম নিন, পরিষ্কার স্থানে রক্ত দিন, পরে পানি ও খাবার খান।'),
              const SizedBox(height: 10),
              const FaqCard(question: 'কতদিন পর আবার রক্ত দেওয়া যায়?', answer: 'সাধারণভাবে অন্তত ৩ মাস পর আবার রক্ত দেওয়া ভালো।'),
            ],
          ),
        );
      },
    );
  }
}

class DonorsPage extends StatefulWidget {
  const DonorsPage({super.key, required this.repository});
  final AppRepository repository;

  @override
  State<DonorsPage> createState() => _DonorsPageState();
}

class _DonorsPageState extends State<DonorsPage> {
  String bloodGroup = '';
  late Future<List<DonorItem>> future;

  @override
  void initState() {
    super.initState();
    future = widget.repository.fetchDonors();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('রক্তদাতা খুঁজুন')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          DropdownButtonFormField<String>(
            initialValue: bloodGroup.isEmpty ? null : bloodGroup,
            decoration: const InputDecoration(labelText: 'রক্তের গ্রুপ'),
            items: _bloodGroups.map((group) => DropdownMenuItem(value: group, child: Text(group))).toList(),
            onChanged: (value) {
              setState(() {
                bloodGroup = value ?? '';
                future = widget.repository.fetchDonors(bloodGroup: bloodGroup);
              });
            },
          ),
          const SizedBox(height: 16),
          FutureBuilder<List<DonorItem>>(
            future: future,
            builder: (context, snapshot) {
              final donors = snapshot.data ?? DonorItem.demo;
              return Column(
                children: donors.map((item) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: DonorCard(item: item),
                )).toList(),
              );
            },
          ),
        ],
      ),
    );
  }
}

class RequestsPage extends StatefulWidget {
  const RequestsPage({super.key, required this.repository});
  final AppRepository repository;

  @override
  State<RequestsPage> createState() => _RequestsPageState();
}

class _RequestsPageState extends State<RequestsPage> {
  String bloodGroup = '';
  late Future<List<RequestItem>> future;

  @override
  void initState() {
    super.initState();
    future = widget.repository.fetchRequests();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('রক্তের অনুরোধ'),
        actions: [
          IconButton(
            onPressed: () => context.push('/request/new'),
            icon: const Icon(Icons.add_rounded),
          )
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          DropdownButtonFormField<String>(
            initialValue: bloodGroup.isEmpty ? null : bloodGroup,
            decoration: const InputDecoration(labelText: 'রক্তের গ্রুপ'),
            items: _bloodGroups.map((group) => DropdownMenuItem(value: group, child: Text(group))).toList(),
            onChanged: (value) {
              setState(() {
                bloodGroup = value ?? '';
                future = widget.repository.fetchRequests(bloodGroup: bloodGroup);
              });
            },
          ),
          const SizedBox(height: 16),
          FutureBuilder<List<RequestItem>>(
            future: future,
            builder: (context, snapshot) {
              final requests = snapshot.data ?? RequestItem.demo;
              return Column(
                children: requests.map((item) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: RequestCard(item: item),
                )).toList(),
              );
            },
          ),
        ],
      ),
    );
  }
}

class CampaignsPage extends StatelessWidget {
  const CampaignsPage({super.key, required this.repository});
  final AppRepository repository;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('ক্যাম্পেইন')),
      body: FutureBuilder<List<CampaignItem>>(
        future: repository.fetchCampaigns(),
        builder: (context, snapshot) {
          final items = snapshot.data ?? CampaignItem.demo;
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemBuilder: (context, index) => CampaignCard(item: items[index]),
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemCount: items.length,
          );
        },
      ),
    );
  }
}

class AccountPage extends StatefulWidget {
  const AccountPage({super.key, required this.repository});
  final AppRepository repository;

  @override
  State<AccountPage> createState() => _AccountPageState();
}

class _AccountPageState extends State<AccountPage> {
  late StreamSubscription<AuthState> _subscription;
  bool showLogin = true;

  @override
  void initState() {
    super.initState();
    _subscription = widget.repository.authChanges().listen((_) {
      if (mounted) setState(() {});
    });
  }

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final user = widget.repository.currentUser;
    return user == null ? _AuthPage(repository: widget.repository, showLogin: showLogin, onToggle: () => setState(() => showLogin = !showLogin)) : _DashboardPage(repository: widget.repository);
  }
}

class _AuthPage extends StatefulWidget {
  const _AuthPage({required this.repository, required this.showLogin, required this.onToggle});
  final AppRepository repository;
  final bool showLogin;
  final VoidCallback onToggle;

  @override
  State<_AuthPage> createState() => _AuthPageState();
}

class _AuthPageState extends State<_AuthPage> {
  final nameController = TextEditingController();
  final phoneController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  List<OrganizationItem> organizations = [];
  String? organizationId;
  bool loading = false;

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
      if (widget.showLogin) {
        await widget.repository.signIn(emailController.text.trim(), passwordController.text.trim());
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
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('সফল হয়েছে')));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
      }
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('আমার')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(widget.showLogin ? 'লগ ইন' : 'নিবন্ধন', style: Theme.of(context).textTheme.headlineSmall),
                  const SizedBox(height: 16),
                  if (!widget.showLogin) ...[
                    TextField(controller: nameController, decoration: const InputDecoration(labelText: 'পূর্ণ নাম')),
                    const SizedBox(height: 12),
                    TextField(controller: phoneController, decoration: const InputDecoration(labelText: 'ফোন')),
                    const SizedBox(height: 12),
                  ],
                  TextField(controller: emailController, decoration: const InputDecoration(labelText: 'ইমেইল')),
                  const SizedBox(height: 12),
                  TextField(controller: passwordController, obscureText: true, decoration: const InputDecoration(labelText: 'পাসওয়ার্ড')),
                  if (!widget.showLogin) ...[
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      initialValue: organizationId,
                      decoration: const InputDecoration(labelText: 'আপনি কোন সংগঠনের'),
                      items: [
                        const DropdownMenuItem(value: 'none', child: Text('আমি কোনো সংগঠনের না')),
                        ...organizations.map((item) => DropdownMenuItem(value: item.id, child: Text(item.name))),
                      ],
                      onChanged: (value) => setState(() => organizationId = value),
                    ),
                  ],
                  const SizedBox(height: 18),
                  ElevatedButton(
                    onPressed: loading ? null : submit,
                    child: Text(widget.showLogin ? 'লগ ইন করুন' : 'অ্যাকাউন্ট খুলুন'),
                  ),
                  const SizedBox(height: 10),
                  TextButton(
                    onPressed: widget.onToggle,
                    child: Text(widget.showLogin ? 'নতুন? নিবন্ধন করুন' : 'অ্যাকাউন্ট আছে? লগ ইন'),
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

class _DashboardPage extends StatelessWidget {
  const _DashboardPage({required this.repository});
  final AppRepository repository;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('আমার অ্যাকাউন্ট'),
        actions: [
          IconButton(onPressed: () => repository.signOut(), icon: const Icon(Icons.logout_rounded)),
        ],
      ),
      body: FutureBuilder<ProfileBundle?>(
        future: repository.fetchMyProfile(),
        builder: (context, snapshot) {
          final bundle = snapshot.data;
          final donor = bundle?.donorRow;
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text((bundle?.userRow['full_name'] ?? repository.currentUser?.email ?? 'ব্যবহারকারী').toString(), style: Theme.of(context).textTheme.headlineSmall),
                      const SizedBox(height: 8),
                      Text(bundle?.organization?.name ?? 'কোনো সংগঠন যুক্ত নেই'),
                      const SizedBox(height: 14),
                      Row(
                        children: [
                          Expanded(child: _MiniInfo(label: 'রক্তের গ্রুপ', value: donor?['blood_group']?.toString() ?? '—')),
                          const SizedBox(width: 10),
                          Expanded(child: _MiniInfo(label: 'মোট দান', value: '${donor?['total_donations'] ?? 0}')),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Expanded(
                            child: ElevatedButton(
                              onPressed: () => context.push('/profile/edit'),
                              child: const Text('প্রোফাইল আপডেট'),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () => context.push('/organizations'),
                              style: OutlinedButton.styleFrom(
                                minimumSize: const Size.fromHeight(56),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
                              ),
                              child: const Text('সংগঠন'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              ListTile(
                contentPadding: const EdgeInsets.symmetric(horizontal: 8),
                title: const Text('রক্তের অনুরোধ দিন'),
                trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
                onTap: () => context.push('/request/new'),
              ),
              ListTile(
                contentPadding: const EdgeInsets.symmetric(horizontal: 8),
                title: const Text('ব্লাড ব্যাংক'),
                trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
                onTap: () => context.push('/banks'),
              ),
              ListTile(
                contentPadding: const EdgeInsets.symmetric(horizontal: 8),
                title: const Text('সচেতনতা'),
                trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
                onTap: () => context.push('/awareness'),
              ),
            ],
          );
        },
      ),
    );
  }
}

class CreateRequestPage extends StatefulWidget {
  const CreateRequestPage({super.key, required this.repository});
  final AppRepository repository;

  @override
  State<CreateRequestPage> createState() => _CreateRequestPageState();
}

class _CreateRequestPageState extends State<CreateRequestPage> {
  final patient = TextEditingController();
  final hospital = TextEditingController();
  final location = TextEditingController();
  final contact = TextEditingController();
  final phone = TextEditingController();
  final details = TextEditingController();
  String bloodGroup = 'B+';
  String urgency = 'Emergency';

  Future<void> save() async {
    try {
      await widget.repository.createBloodRequest({
        'patient_name': patient.text.trim(),
        'blood_group': bloodGroup,
        'quantity_bags': 1,
        'required_date': DateTime.now().add(const Duration(days: 1)).toIso8601String(),
        'hospital_name': hospital.text.trim(),
        'division': location.text.trim(),
        'district': location.text.trim(),
        'upazila': location.text.trim(),
        'address': location.text.trim(),
        'contact_name': contact.text.trim(),
        'contact_phone': phone.text.trim(),
        'urgency': urgency,
        'details': details.text.trim(),
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('অনুরোধ যোগ হয়েছে')));
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('রক্তের অনুরোধ দিন')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          TextField(controller: patient, decoration: const InputDecoration(labelText: 'রোগীর নাম')),
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            initialValue: bloodGroup,
            decoration: const InputDecoration(labelText: 'রক্তের গ্রুপ'),
            items: _bloodGroups.map((group) => DropdownMenuItem(value: group, child: Text(group))).toList(),
            onChanged: (value) => setState(() => bloodGroup = value ?? 'B+'),
          ),
          const SizedBox(height: 12),
          TextField(controller: hospital, decoration: const InputDecoration(labelText: 'হাসপাতাল')),
          const SizedBox(height: 12),
          TextField(controller: location, decoration: const InputDecoration(labelText: 'লোকেশন')),
          const SizedBox(height: 12),
          TextField(controller: contact, decoration: const InputDecoration(labelText: 'যোগাযোগ ব্যক্তির নাম')),
          const SizedBox(height: 12),
          TextField(controller: phone, decoration: const InputDecoration(labelText: 'ফোন')),
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            initialValue: urgency,
            decoration: const InputDecoration(labelText: 'জরুরি স্তর'),
            items: const ['Emergency', 'Urgent', 'Normal'].map((item) => DropdownMenuItem(value: item, child: Text(item))).toList(),
            onChanged: (value) => setState(() => urgency = value ?? 'Emergency'),
          ),
          const SizedBox(height: 12),
          TextField(controller: details, maxLines: 4, decoration: const InputDecoration(labelText: 'অতিরিক্ত তথ্য')),
          const SizedBox(height: 18),
          ElevatedButton(onPressed: save, child: const Text('সেভ করুন')),
        ],
      ),
    );
  }
}

class CreateOrganizationPage extends StatefulWidget {
  const CreateOrganizationPage({super.key, required this.repository});
  final AppRepository repository;

  @override
  State<CreateOrganizationPage> createState() => _CreateOrganizationPageState();
}

class _CreateOrganizationPageState extends State<CreateOrganizationPage> {
  final name = TextEditingController();
  final slug = TextEditingController();
  final description = TextEditingController();
  final division = TextEditingController();
  final district = TextEditingController();
  final upazila = TextEditingController();
  final phone = TextEditingController();
  final email = TextEditingController();

  Future<void> save() async {
    try {
      await widget.repository.createOrganization({
        'name': name.text.trim(),
        'slug': slug.text.trim(),
        'description': description.text.trim(),
        'division': division.text.trim(),
        'district': district.text.trim(),
        'upazila': upazila.text.trim(),
        'contact_phone': phone.text.trim(),
        'contact_email': email.text.trim(),
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('সংগঠন যোগ হয়েছে')));
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('সংগঠন হিসাবে যুক্ত হোন')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          TextField(controller: name, decoration: const InputDecoration(labelText: 'সংগঠনের নাম')),
          const SizedBox(height: 12),
          TextField(controller: slug, decoration: const InputDecoration(labelText: 'স্লাগ')),
          const SizedBox(height: 12),
          TextField(controller: description, maxLines: 4, decoration: const InputDecoration(labelText: 'বর্ণনা')),
          const SizedBox(height: 12),
          TextField(controller: division, decoration: const InputDecoration(labelText: 'বিভাগ')),
          const SizedBox(height: 12),
          TextField(controller: district, decoration: const InputDecoration(labelText: 'জেলা')),
          const SizedBox(height: 12),
          TextField(controller: upazila, decoration: const InputDecoration(labelText: 'উপজেলা')),
          const SizedBox(height: 12),
          TextField(controller: phone, decoration: const InputDecoration(labelText: 'ফোন')),
          const SizedBox(height: 12),
          TextField(controller: email, decoration: const InputDecoration(labelText: 'ইমেইল')),
          const SizedBox(height: 18),
          ElevatedButton(onPressed: save, child: const Text('সেভ করুন')),
        ],
      ),
    );
  }
}

class OrganizationsPage extends StatelessWidget {
  const OrganizationsPage({super.key, required this.repository});
  final AppRepository repository;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('সংগঠন')),
      body: FutureBuilder<List<OrganizationItem>>(
        future: repository.fetchOrganizations(),
        builder: (context, snapshot) {
          final items = snapshot.data ?? OrganizationItem.demo;
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemBuilder: (context, index) => OrganizationCard(
              item: items[index],
              onTap: () => context.push('/organizations/${items[index].slug}'),
            ),
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemCount: items.length,
          );
        },
      ),
    );
  }
}

class OrganizationDetailsPage extends StatelessWidget {
  const OrganizationDetailsPage({super.key, required this.repository, required this.slug});
  final AppRepository repository;
  final String slug;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('সংগঠন প্রোফাইল')),
      body: FutureBuilder<List<OrganizationItem>>(
        future: repository.fetchOrganizations(),
        builder: (context, snapshot) {
          final items = snapshot.data ?? OrganizationItem.demo;
          final item = items.firstWhere((element) => element.slug == slug, orElse: () => items.first);
          return FutureBuilder<List<MemberItem>>(
            future: repository.fetchOrganizationMembers(item.id),
            builder: (context, memberSnapshot) {
              final members = memberSnapshot.data ?? MemberItem.demo;
              return ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  OrganizationCard(item: item),
                  const SizedBox(height: 16),
                  Text('যারা যুক্ত হয়েছে', style: Theme.of(context).textTheme.titleLarge),
                  const SizedBox(height: 10),
                  ...members.map((member) => Card(
                        child: ListTile(
                          title: Text(member.name),
                          subtitle: Text(member.bloodGroup),
                          trailing: TextButton(
                            onPressed: () {},
                            child: Text(member.phone),
                          ),
                        ),
                      )),
                ],
              );
            },
          );
        },
      ),
    );
  }
}

class AwarenessPage extends StatelessWidget {
  const AwarenessPage({super.key, required this.repository});
  final AppRepository repository;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('ব্লগ ও তথ্য')),
      body: FutureBuilder<List<AwarenessItem>>(
        future: repository.fetchAwareness(),
        builder: (context, snapshot) {
          final items = snapshot.data ?? AwarenessItem.demo;
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemBuilder: (context, index) => AwarenessCard(item: items[index]),
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemCount: items.length,
          );
        },
      ),
    );
  }
}

class BloodBanksPage extends StatelessWidget {
  const BloodBanksPage({super.key, required this.repository});
  final AppRepository repository;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('ব্লাড ব্যাংক')),
      body: FutureBuilder<List<BloodBankItem>>(
        future: repository.fetchBloodBanks(),
        builder: (context, snapshot) {
          final items = snapshot.data ?? BloodBankItem.demo;
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemBuilder: (context, index) => Card(
              child: ListTile(
                title: Text(items[index].name),
                subtitle: Text(items[index].address),
                trailing: TextButton(
                  onPressed: () {},
                  child: Text(items[index].phone),
                ),
              ),
            ),
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemCount: items.length,
          );
        },
      ),
    );
  }
}

class EditProfilePage extends StatefulWidget {
  const EditProfilePage({super.key, required this.repository});
  final AppRepository repository;

  @override
  State<EditProfilePage> createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  final name = TextEditingController();
  final phone = TextEditingController();
  final division = TextEditingController();
  final district = TextEditingController();
  final upazila = TextEditingController();
  final address = TextEditingController();
  String bloodGroup = 'B+';

  Future<void> save() async {
    try {
      await widget.repository.saveDonorProfile({
        'full_name': name.text.trim(),
        'phone': phone.text.trim(),
        'blood_group': bloodGroup,
        'gender': 'male',
        'division': division.text.trim(),
        'district': district.text.trim(),
        'upazila': upazila.text.trim(),
        'address': address.text.trim(),
        'total_donations': 0,
        'availability_status': 'available',
        'can_donate_urgently': true,
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('প্রোফাইল সেভ হয়েছে')));
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('প্রোফাইল আপডেট')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          TextField(controller: name, decoration: const InputDecoration(labelText: 'পূর্ণ নাম')),
          const SizedBox(height: 12),
          TextField(controller: phone, decoration: const InputDecoration(labelText: 'ফোন')),
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            initialValue: bloodGroup,
            decoration: const InputDecoration(labelText: 'রক্তের গ্রুপ'),
            items: _bloodGroups.map((group) => DropdownMenuItem(value: group, child: Text(group))).toList(),
            onChanged: (value) => setState(() => bloodGroup = value ?? 'B+'),
          ),
          const SizedBox(height: 12),
          TextField(controller: division, decoration: const InputDecoration(labelText: 'বিভাগ')),
          const SizedBox(height: 12),
          TextField(controller: district, decoration: const InputDecoration(labelText: 'জেলা')),
          const SizedBox(height: 12),
          TextField(controller: upazila, decoration: const InputDecoration(labelText: 'উপজেলা')),
          const SizedBox(height: 12),
          TextField(controller: address, maxLines: 3, decoration: const InputDecoration(labelText: 'ঠিকানা')),
          const SizedBox(height: 18),
          ElevatedButton(onPressed: save, child: const Text('সেভ করুন')),
        ],
      ),
    );
  }
}

class BrandTitle extends StatelessWidget {
  const BrandTitle({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text('বেড়া', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white)),
        Text('রক্তদাতা', style: TextStyle(fontSize: 23, fontWeight: FontWeight.w900, color: Colors.white, height: 0.95)),
        Text('ইউনিট', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white)),
      ],
    );
  }
}

class _StatCard extends StatelessWidget {
  const _StatCard({required this.label, required this.value});
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: Theme.of(context).textTheme.bodyMedium),
            const SizedBox(height: 8),
            Text(value, style: Theme.of(context).textTheme.headlineSmall?.copyWith(color: const Color(0xFFC8382A))),
          ],
        ),
      ),
    );
  }
}

class BenefitsCard extends StatelessWidget {
  const BenefitsCard({super.key});

  @override
  Widget build(BuildContext context) {
    const items = [
      'হৃদরোগের ঝুঁকি কমাতে সহায়তা করে',
      'শরীরে নতুন রক্তকোষ তৈরিতে ভূমিকা রাখে',
      'নিয়মিত স্বাস্থ্য পরীক্ষার সুযোগ বাড়ায়',
      'মানসিক তৃপ্তি ও সামাজিক দায়বদ্ধতা জাগায়',
    ];
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('রক্তদানের উপকারিতা', style: Theme.of(context).textTheme.headlineSmall?.copyWith(color: const Color(0xFFC8382A))),
            const SizedBox(height: 8),
            Text('রক্তদান শরীর ও মনের জন্য ইতিবাচক।', style: Theme.of(context).textTheme.bodyLarge),
            const SizedBox(height: 16),
            ...items.map((item) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Row(
                    children: [
                      const CircleAvatar(
                        radius: 16,
                        backgroundColor: Color(0xFFFFE9E6),
                        child: Icon(Icons.check_rounded, color: Color(0xFFC8382A), size: 18),
                      ),
                      const SizedBox(width: 12),
                      Expanded(child: Text(item, style: Theme.of(context).textTheme.titleMedium)),
                    ],
                  ),
                )),
          ],
        ),
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  const _SectionHeader({required this.title, required this.action, required this.onTap});
  final String title;
  final String action;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(child: Text(title, style: Theme.of(context).textTheme.titleLarge)),
        TextButton(onPressed: onTap, child: Text(action)),
      ],
    );
  }
}

class CampaignCard extends StatelessWidget {
  const CampaignCard({super.key, required this.item});
  final CampaignItem item;

  @override
  Widget build(BuildContext context) {
    final date = DateTime.tryParse(item.eventDate);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(22),
              child: Image.asset('assets/images/one.jpg', height: 140, width: double.infinity, fit: BoxFit.cover),
            ),
            const SizedBox(height: 12),
            Text(item.title, style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 6),
            Text(item.location),
            const SizedBox(height: 6),
            Text(date == null ? item.eventDate : DateFormat('d MMM y').format(date)),
          ],
        ),
      ),
    );
  }
}

class AwarenessCard extends StatelessWidget {
  const AwarenessCard({super.key, required this.item});
  final AwarenessItem item;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 92,
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFFFFEFEF), Color(0xFFFFF9F8)]),
                borderRadius: BorderRadius.circular(22),
              ),
              child: const Center(child: Icon(Icons.favorite_rounded, color: Color(0xFFC8382A), size: 38)),
            ),
            const SizedBox(height: 12),
            Text(item.title, style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 6),
            Text(item.excerpt, maxLines: 2, overflow: TextOverflow.ellipsis),
          ],
        ),
      ),
    );
  }
}

class OrganizationCard extends StatelessWidget {
  const OrganizationCard({super.key, required this.item, this.onTap});
  final OrganizationItem item;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(28),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(item.name, style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 6),
              Text(item.description, maxLines: 2, overflow: TextOverflow.ellipsis),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(child: Text(item.location)),
                  Text('${item.memberCount} জন'),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class DonorCard extends StatelessWidget {
  const DonorCard({super.key, required this.item});
  final DonorItem item;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(radius: 26, backgroundColor: const Color(0xFFEFF2F6), child: Text(item.name.isEmpty ? 'M' : item.name.characters.first)),
                const SizedBox(width: 12),
                Expanded(child: Text(item.name, style: Theme.of(context).textTheme.titleLarge)),
                _Badge(label: item.bloodGroup, blood: true),
              ],
            ),
            const SizedBox(height: 14),
            _DetailRow(icon: Icons.location_on_outlined, text: item.location),
            const SizedBox(height: 8),
            _DetailRow(icon: Icons.calendar_month_rounded, text: 'সর্বশেষ: ${_formatDate(item.lastDonation)}'),
            const SizedBox(height: 8),
            _DetailRow(icon: Icons.favorite_border_rounded, text: 'মোট: ${item.totalDonation} বার'),
            const SizedBox(height: 12),
            Row(
              children: [
                _Badge(label: item.availabilityText, blood: false),
                const SizedBox(width: 10),
                if (item.verified) const _Badge(label: 'ভেরিফায়েড', blood: false),
              ],
            ),
            const SizedBox(height: 14),
            ElevatedButton(
              onPressed: () {},
              child: const Text('কল করুন'),
            ),
          ],
        ),
      ),
    );
  }
}

class RequestCard extends StatelessWidget {
  const RequestCard({super.key, required this.item});
  final RequestItem item;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(child: Text(item.patientName, style: Theme.of(context).textTheme.titleLarge)),
                _Badge(label: item.bloodGroup, blood: true),
              ],
            ),
            const SizedBox(height: 10),
            Text(item.hospital),
            const SizedBox(height: 6),
            Text(item.location),
            const SizedBox(height: 10),
            Row(
              children: [
                _Badge(label: item.urgency, blood: false),
                const SizedBox(width: 10),
                Text('${item.units} ব্যাগ'),
              ],
            ),
            const SizedBox(height: 14),
            ElevatedButton(onPressed: () {}, child: const Text('যোগাযোগ করুন')),
          ],
        ),
      ),
    );
  }
}

class _Badge extends StatelessWidget {
  const _Badge({required this.label, required this.blood});
  final String label;
  final bool blood;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
      decoration: BoxDecoration(
        color: blood ? const Color(0xFFC8382A) : const Color(0xFFEAF4EE),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: blood ? Colors.white : const Color(0xFF4B7A5D),
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  const _DetailRow({required this.icon, required this.text});
  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 18, color: const Color(0xFFC8382A)),
        const SizedBox(width: 8),
        Expanded(child: Text(text)),
      ],
    );
  }
}

class _MiniInfo extends StatelessWidget {
  const _MiniInfo({required this.label, required this.value});
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFF6F2EF),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label),
          const SizedBox(height: 8),
          Text(value, style: Theme.of(context).textTheme.titleLarge),
        ],
      ),
    );
  }
}

class FaqCard extends StatelessWidget {
  const FaqCard({super.key, required this.question, required this.answer});
  final String question;
  final String answer;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(question, style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 6),
            Text(answer),
          ],
        ),
      ),
    );
  }
}

String _formatDate(String? date) {
  if (date == null || date.isEmpty) return '—';
  final parsed = DateTime.tryParse(date);
  if (parsed == null) return date;
  return DateFormat('dd MMM yyyy').format(parsed);
}
