/**
 * Seed data for the homepage block editor.
 *
 * When the admin clicks "Import current homepage content" on /admin/homepage
 * we insert these blocks in order. This gives them an editable starting
 * point that matches (roughly) what the site currently displays when no
 * blocks exist in the DB.
 *
 * Each block is a faithful representation of the corresponding hardcoded
 * section in app/page.tsx — not byte-for-byte, but covers the same content
 * and is easily editable via the admin UI.
 */

export interface SeedBlock {
  block_type:
    | 'heading' | 'rich-text' | 'image' | 'two-column'
    | 'visual-break' | 'cta-box' | 'feature-grid'
  data: Record<string, any>
}

export const HOMEPAGE_SEED_BLOCKS: SeedBlock[] = [
  // ── 1. Intro heading ───────────────────────────────────────────────
  {
    block_type: 'heading',
    data: {
      title: 'Free Mushroom Identification App by Photos',
      level: 'h2',
      align: 'center',
    },
  },
  {
    block_type: 'rich-text',
    data: {
      html: `<p>By uploading clear images showing the cap, gills, pores, stem, and surrounding habitat, the system extracts visual traits such as cap shape, gill pattern, surface texture, and stem structure, then returns a ranked list of possible species matches.</p>
<p>Many people use a wild mushroom identifier by picture when hiking, exploring forests, or observing fungi in gardens and parks. These tools often work as a mushroom identifier app or web-based identifier that runs directly in a browser. Some platforms also include a helpful mushroom ID chart, allowing users to compare key identification features such as gill attachment, cap shape, spore structures, and habitat clues to better understand mushroom anatomy.</p>
<p>A mushroom identifier is especially useful for hikers, mushroom foragers, students of mycology, nature photographers, and outdoor enthusiasts who want to quickly research unknown fungi. By combining photo analysis, habitat context, and geographic information, the tool can narrow down potential species far faster than manually searching through traditional field guides or fungal reference books.</p>`,
    },
  },
  {
    block_type: 'visual-break',
    data: {
      src: '/wild-mushrooms-forest-floor.webp',
      alt: 'Mushroom identification app — Amanita muscaria (fly agaric) in natural forest habitat',
      credit: 'Photo by Flocci Nivis · Wikimedia Commons · CC BY 4.0',
      height: 400,
    },
  },

  // ── 2. Safety notice ───────────────────────────────────────────────
  {
    block_type: 'cta-box',
    data: {
      variant: 'danger',
      heading: 'Important Safety Notice',
      text: 'A mushroom identifier should always be used as a learning and research aid, not as a final identification authority. Some poisonous mushrooms closely resemble edible ones. For example, Amanita phalloides (death cap) — one of the most toxic mushrooms in the world — can look similar to edible species when young. For safety, never rely solely on an AI result to determine edibility and always consult a local mycologist or mycological society for expert confirmation.',
    },
  },

  // ── 3. How AI Analyzes ─────────────────────────────────────────────
  {
    block_type: 'heading',
    data: {
      title: 'How AI Analyzes Mushroom Features?',
      subtitle: 'This process works similarly to how experienced field mycologists approach identification. Instead of looking at a single trait, the AI evaluates combinations of characteristics:',
      level: 'h2',
      align: 'center',
    },
  },
  {
    block_type: 'rich-text',
    data: {
      html: `<table>
<thead><tr><th>Feature</th><th>Example Observation</th></tr></thead>
<tbody>
<tr><td><strong>Cap shape</strong></td><td>Convex, flat, or bell-shaped</td></tr>
<tr><td><strong>Gill attachment</strong></td><td>Free gills, decurrent gills, attached gills</td></tr>
<tr><td><strong>Stem structure</strong></td><td>Hollow stem or solid stem</td></tr>
<tr><td><strong>Habitat</strong></td><td>Growing on wood, soil, moss, or leaf litter</td></tr>
<tr><td><strong>Tree association</strong></td><td>Oak, birch, beech, hemlock, conifer</td></tr>
</tbody></table>
<p style="text-align:center">These traits together help distinguish species that may appear almost identical at first glance.</p>`,
    },
  },

  // ── 4. How to Use — step cards ─────────────────────────────────────
  {
    block_type: 'heading',
    data: {
      title: 'How to Use the Mushroom Identifier?',
      subtitle: 'Identifying a mushroom with an AI mushroom identifier only takes a minute if you capture the right details. The tool uses computer vision and fungal species databases to compare your photos with thousands of known mushroom and fungi specimens.',
      level: 'h2',
      align: 'center',
    },
  },
  {
    block_type: 'feature-grid',
    data: {
      columns: 3,
      items: [
        { title: '01 · Upload Clear Mushroom Photos', description: 'Start by uploading clear, well-lit images of the mushroom. The AI analyzes visual traits such as cap color, texture, gill pattern, and stem structure.' },
        { title: '02 · Capture Multiple Angles', description: 'Upload several angles so the image recognition system can detect more identifying features. Recommended: cap (top view), side profile, underside (gills, pores).' },
        { title: '03 · Photograph the Cap', description: 'Top-down photo showing cap shape, color and patterns, and surface texture (smooth, scaly, warty). Narrows down potential fungal species.' },
        { title: '04 · Show the Underside', description: 'Turn the mushroom over and photograph the gills, pores, or spines. These structures are often the most important diagnostic feature in mycology.' },
        { title: '05 · Capture the Stem and Base', description: 'Photograph the full stem and base before removing the mushroom. May reveal ring, volva, or basal bulb — critical for Amanita identification.' },
        { title: '06 · Include the Habitat', description: 'Take a photo showing soil or moss, leaf litter, decaying wood or logs, and nearby trees (oak, birch, conifer).' },
        { title: '07 · Enter Location and Date', description: 'Provide the geographic location and date when the mushroom was found. Helps filter species by range, seasonality, and climate.' },
        { title: '08 · Add Observational Notes', description: 'Include details the camera cannot capture: odor, bruising reactions, spore print color, cap texture (slimy, dry, velvety).' },
        { title: '09 · Run the AI Identification', description: 'Click Identify Mushroom. The AI analyzes uploaded images using machine learning and returns a ranked list of possible species.' },
        { title: '10 · Review Results Carefully', description: 'Treat results as a starting point, not a final answer. Many mushrooms have dangerous look-alikes including toxic species like Amanita phalloides.' },
      ],
    },
  },

  // ── 5. Visual break — forager ──────────────────────────────────────
  {
    block_type: 'visual-break',
    data: {
      src: '/person-foraging-mushroom-nature.webp',
      alt: 'Mushroom identification app — forager holding freshly picked Cantharellus cibarius (golden chanterelles)',
      credit: 'Photo by Gunnar Creutz · Wikimedia Commons · CC BY-SA 4.0',
      height: 420,
    },
  },

  // ── 6. Who this is for ────────────────────────────────────────────
  {
    block_type: 'heading',
    data: {
      title: 'Who This Mushroom Identifier Is For?',
      subtitle: 'The mushroom identifier is designed for anyone curious about fungi in the wild. It can be especially helpful for:',
      level: 'h2',
      align: 'center',
    },
  },
  {
    block_type: 'rich-text',
    data: {
      html: `<ul>
<li>✓ <strong>Hikers and outdoor explorers</strong> encountering mushrooms on trails</li>
<li>✓ <strong>Backyard nature observers</strong> discovering fungi in gardens or lawns</li>
<li>✓ <strong>Mushroom foragers</strong> researching species before consulting experts</li>
<li>✓ <strong>Students</strong> studying mycology or forest ecology</li>
<li>✓ <strong>Nature photographers</strong> documenting fungal diversity</li>
</ul>
<p>Whether you are walking through a Pacific Northwest conifer forest, exploring a Rocky Mountain meadow, or simply observing mushrooms growing on a fallen hardwood log, the tool can provide a quick starting point for understanding what species you may be seeing.</p>
<p>Want to sharpen your identification skills before heading into the field? Try our free <a href="/mushroom-identification-quiz">mushroom identification quiz</a> — 50 expert questions covering toxic species, edible fungi, and anatomy terms with a 30-second timer per question.</p>`,
    },
  },

  // ── 7. How AI Helps ───────────────────────────────────────────────
  {
    block_type: 'heading',
    data: { title: 'How AI Helps Identify Mushrooms?', level: 'h2', align: 'center' },
  },
  {
    block_type: 'rich-text',
    data: {
      html: `<p>Artificial intelligence enables rapid mushroom recognition by combining several technologies:</p>
<ul>
<li>✓ <strong>Computer vision</strong> to detect patterns in images</li>
<li>✓ <strong>Machine learning models</strong> trained on fungal specimen photos</li>
<li>✓ <strong>Feature extraction algorithms</strong> identifying structural traits</li>
<li>✓ <strong>Species probability ranking</strong> based on visual similarity and context</li>
</ul>
<p>Instead of relying solely on color, the AI evaluates multiple anatomical features simultaneously: cap color and surface texture, gill or pore structure, stem thickness and internal structure, presence of a ring, veil, or volva, growth pattern and clustering, and habitat and substrate information. This approach helps distinguish closely related fungi and identify potential look-alike species, which are common in the fungal world.</p>`,
    },
  },

  // ── 8. Visual break — gills close-up ──────────────────────────────
  {
    block_type: 'visual-break',
    data: {
      src: '/mushroom-gills-closeup-macro.webp',
      alt: 'Mushroom identification app — macro close-up of Cortinarius violaceus gills showing radial lamellae structure',
      credit: 'Photo by 00Amanita00 · Wikimedia Commons · CC BY-SA 3.0',
      height: 380,
    },
  },

  // ── 9. Why Caution ────────────────────────────────────────────────
  {
    block_type: 'heading',
    data: { title: 'Why Mushroom Identification Requires Caution?', level: 'h2', align: 'center' },
  },
  {
    block_type: 'rich-text',
    data: {
      html: `<p>Identifying mushrooms is complex because many species share similar visual traits. Some of the most dangerous fungi — including members of the Amanita genus — resemble edible mushrooms commonly collected by beginners.</p>
<ul>
<li><strong><a href="/amanita-phalloides-death-cap">Amanita phalloides (death cap)</a></strong> — responsible for many fatal mushroom poisonings worldwide</li>
<li><strong>Amanita bisporigera (destroying angel)</strong> — visually similar to edible button mushrooms when young</li>
</ul>
<p>Other highly dangerous species include <a href="/amanita-virosa-mushroom">Amanita virosa (destroying angel)</a>, <a href="/amanita-ocreata">Amanita ocreata (western destroying angel)</a>, <a href="/cortinarius-rubellus">Cortinarius rubellus (deadly webcap)</a>, <a href="/galerina-marginata">Galerina marginata (funeral bell)</a>, and <a href="/lepiota-brunneoincarnata">Lepiota brunneoincarnata (deadly dapperling)</a>. Toxic mushrooms in the Amanita genus, such as <a href="/amanita-muscaria">Amanita muscaria (fly agaric)</a> and <a href="/amanita-pantherina">Amanita pantherina (panther cap)</a>, can also cause severe poisoning.</p>
<p>Even experienced mycologists often rely on additional diagnostic signals such as spore print color, bruising reactions, smell or odor, and microscopic examination. Because a photo cannot capture all of these details, a mushroom identifier should always be treated as a starting point for research, not a final answer.</p>`,
    },
  },

  // ── 10. When not to rely ──────────────────────────────────────────
  {
    block_type: 'heading',
    data: { title: 'When You Should Not Rely Only on a Mushroom Identifier?', level: 'h2', align: 'center' },
  },
  {
    block_type: 'rich-text',
    data: {
      html: `<p>An AI mushroom identifier is an excellent starting point for recognizing fungi, but it should never be the only source used to make important decisions about wild mushrooms. Even the most advanced computer vision and machine learning systems cannot replace the experience of a trained mycologist or the careful verification methods used in traditional mycology.</p>
<p>Certain situations require additional caution because visual similarity between mushroom species is extremely common. Many edible mushrooms have dangerous look-alikes that share similar cap color, gill structure, or stem appearance.</p>
<h3>Avoid relying only on a mushroom identifier when:</h3>
<ul>
<li>⚠️ Deciding whether a wild mushroom is edible</li>
<li>⚠️ A mushroom is suspected to be toxic or poisonous</li>
<li>⚠️ Children or pets may have touched or ingested a mushroom</li>
<li>⚠️ Identifying mushrooms belonging to high-risk genera such as Amanita</li>
<li>⚠️ The mushroom's base, spore print, or bruising reaction cannot be observed</li>
<li>⚠️ The mushroom grows in unusual habitats or rare environments</li>
</ul>`,
    },
  },
  {
    block_type: 'cta-box',
    data: {
      variant: 'danger',
      heading: 'Safest approach',
      text: 'In these cases, the safest approach is to consult a local mycologist, regional mycological society, or poison control center. AI tools are powerful for research and learning, but they should always be used as supporting tools rather than final authorities.',
    },
  },

  // ── 11. Best practices ────────────────────────────────────────────
  {
    block_type: 'heading',
    data: {
      title: 'Best Practices for Safer Mushroom Identification',
      subtitle: 'Successful mushroom identification relies on careful observation, accurate documentation, and verification from multiple sources.',
      level: 'h2',
      align: 'center',
    },
  },
  {
    block_type: 'rich-text',
    data: {
      html: `<h3>Key Practices Used by Mycologists</h3>
<p>Professional mushroom experts follow a consistent process when identifying fungi in nature:</p>
<h4>✓ Observe the specimen before touching it</h4>
<ul>
<li>Look at the cap shape, color, and surface texture</li>
<li>Note whether the mushroom grows alone or in clusters</li>
<li>Check if it is growing on soil, moss, wood, or leaf litter</li>
</ul>
<h4>✓ Photograph the mushroom in its habitat</h4>
<ul>
<li>Decaying hardwood logs</li>
<li>Conifer forest floors</li>
<li>Fallen branches or buried roots</li>
<li>Open meadows or woodland edges</li>
</ul>
<h4>✓ Document structural traits</h4>
<ul>
<li><strong>Cap</strong> – color, shape, scales, or warts</li>
<li><strong>Gills or pores</strong> – spacing and attachment to the stem</li>
<li><strong>Stem</strong> – thickness, texture, hollow or solid interior</li>
<li><strong>Ring or veil</strong> – protective structures beneath the cap</li>
<li><strong>Volva or basal bulb</strong> – structures at the base of certain species</li>
</ul>
<h4>✓ Record environmental context</h4>
<ul>
<li>Location and geographic region</li>
<li>Nearby tree species such as oak, birch, beech, or hemlock</li>
<li>Substrate (soil, wood, moss, dung)</li>
<li>Elevation and climate conditions</li>
</ul>
<p><em>These ecological clues help narrow the list of possible fungal species.</em></p>`,
    },
  },

  // ── 12. Visual break — cluster on wood ────────────────────────────
  {
    block_type: 'visual-break',
    data: {
      src: '/mushroom-cluster-growing-on-wood.webp',
      alt: 'Mushroom identification app — Pleurotus ostreatus (oyster mushroom) cluster growing on fallen wood',
      credit: 'Photo by Rosser1954 · Wikimedia Commons · Public Domain',
      height: 400,
    },
  },

  // ── 13. Habitats ──────────────────────────────────────────────────
  {
    block_type: 'heading',
    data: {
      title: 'Mushroom Identification in Different Habitats',
      subtitle: 'Habitat is one of the most important clues in accurate mushroom identification. Most fungi grow in very specific environments and form relationships with certain trees, soil types, grasslands, or decaying wood.',
      level: 'h2',
      align: 'center',
    },
  },
  {
    block_type: 'feature-grid',
    data: {
      columns: 3,
      items: [
        { title: 'Mushrooms Growing on Soil', description: 'Many mushrooms appear directly from forest soil, especially in woodland environments. These species are often mycorrhizal fungi — they form beneficial underground partnerships with tree roots. Often found near oak, beech, birch, or conifer trees.' },
        { title: 'Mushrooms Growing on Moss', description: 'Some fungi prefer moist moss-covered environments. Moss retains water and organic matter, creating ideal conditions for small woodland mushrooms. Found in damp forest floors, often after rain.' },
        { title: 'Mushrooms Growing on Hardwood Logs', description: 'Many fungi specialize in breaking down decaying hardwood, such as oak, maple, or birch logs. These wood-rotting fungi play a vital ecological role by recycling nutrients back into the forest ecosystem.' },
        { title: 'Mushrooms Growing on Conifer Wood', description: 'Some fungi grow specifically on conifer trees such as pine, spruce, or fir. Conifer wood contains different chemical compounds than hardwood, so certain fungi specialize in breaking it down.' },
        { title: 'Mushrooms Growing on Living Trees', description: 'Some mushrooms grow directly on living trees, especially on damaged or weakened areas of bark. These fungi may act as parasites or decomposers, often forming shelf-like brackets on tree trunks.' },
        { title: 'Mushrooms in Meadows and Grassy Areas', description: 'Not all mushrooms grow in forests. Many species appear in open meadows, lawns, and grassy fields, feeding on organic material in soil. Sometimes associated with fairy rings.' },
      ],
    },
  },
  {
    block_type: 'rich-text',
    data: {
      html: `<p style="text-align:center">In lawns and grassy areas, common species include <a href="/chlorophyllum-molybdites">Chlorophyllum molybdites</a>, one of the most frequently misidentified poisonous mushrooms in North America, and the edible <a href="/agaricus-campestris">Agaricus campestris (field mushroom)</a>. If you find unexpected fungi in your yard, our guide explains <a href="/why-are-mushrooms-growing-in-my-yard">why mushrooms grow in your yard</a> and how to identify them safely.</p>`,
    },
  },

  // ── 14. Wood-growing ──────────────────────────────────────────────
  {
    block_type: 'heading',
    data: { title: 'Can This Tool Identify Mushrooms Growing on Wood?', level: 'h2', align: 'center' },
  },
  {
    block_type: 'rich-text',
    data: {
      html: `<p>Yes. Many distinctive fungi grow on logs, tree trunks, and woody debris, and the mushroom identifier can often recognize these species when clear images are provided. Wood-growing species like <a href="/hypholoma-fasciculare">Hypholoma fasciculare (sulfur tuft)</a> form dense clusters on stumps, while <a href="/pleurotus-ostreatus">oyster mushrooms</a> colonize hardwood logs.</p>
<p>However, the AI needs to see how the mushroom attaches to the wood.</p>
<h3>Helpful photo details include:</h3>
<ul>
<li>✓ Whether the mushroom has a stem</li>
<li>✓ Whether it forms shelf-like brackets</li>
<li>✓ Whether it grows in dense clusters</li>
</ul>
<p>It is also helpful to mention whether the wood appears to be hardwood or conifer, since some fungi specialize in only one type. Including this context helps the system better match the specimen with the correct fungal species database entries.</p>`,
    },
  },

  // ── 15. Accuracy ──────────────────────────────────────────────────
  {
    block_type: 'heading',
    data: { title: 'Mushroom Identification Accuracy: What Affects It Most', level: 'h2', align: 'center' },
  },
  {
    block_type: 'rich-text',
    data: {
      html: `<p>The accuracy of an AI mushroom identifier depends on several factors. While artificial intelligence can analyze visual patterns extremely quickly, the quality of input information plays a major role.</p>
<h3>Factors That Improve Identification Accuracy</h3>
<table>
<thead><tr><th>Factor</th><th>Why It Matters</th></tr></thead>
<tbody>
<tr><td><strong>Multiple photo angles</strong></td><td>Reveals different anatomical features</td></tr>
<tr><td><strong>Clear lighting</strong></td><td>Shows color and surface texture accurately</td></tr>
<tr><td><strong>Habitat photos</strong></td><td>Provides ecological context</td></tr>
<tr><td><strong>Geographic location</strong></td><td>Filters species by regional distribution</td></tr>
<tr><td><strong>Date found</strong></td><td>Accounts for mushroom seasonality</td></tr>
<tr><td><strong>Distinctive species traits</strong></td><td>Reduces confusion with look-alikes</td></tr>
</tbody></table>
<p>Species that are visually unique are usually identified with higher confidence, while mushrooms with many similar relatives can produce multiple possible matches. For example, white mushrooms with free gills and a ring on the stem may belong to several genera, including both edible and toxic species.</p>`,
    },
  },

  // ── 16. Beginners ─────────────────────────────────────────────────
  {
    block_type: 'heading',
    data: { title: 'Mushroom Identification for Beginners', level: 'h2', align: 'center' },
  },
  {
    block_type: 'rich-text',
    data: {
      html: `<p>Learning to identify mushrooms is an exciting process, but beginners should approach it carefully. Many field guides emphasize the importance of observing structural traits, habitat relationships, and ecological patterns rather than relying on a single visual feature.</p>
<h3>Simple Traits to Observe First</h3>
<ul>
<li>✓ Cap shape and color</li>
<li>✓ Presence of gills, pores, or spines</li>
<li>✓ Stem thickness and structure</li>
<li>✓ Whether the mushroom grows on wood or soil</li>
<li>✓ Nearby tree species</li>
</ul>
<p>Even simple observations can dramatically reduce the number of potential species.</p>`,
    },
  },
  {
    block_type: 'cta-box',
    data: {
      variant: 'warning',
      heading: 'Common Beginner Mistakes',
      text: 'Many misidentifications occur because important details are overlooked. Avoid these common errors: taking only one photo of the cap, ignoring the stem base or volva, forgetting to note the habitat, and assuming a mushroom is edible because it resembles a familiar species. Even the edible Agaricus arvensis (horse mushroom) can be confused with the toxic Agaricus xanthodermus (yellow stainer), which causes gastrointestinal distress.',
    },
  },

  // ── 17. Visual break — colorful ───────────────────────────────────
  {
    block_type: 'visual-break',
    data: {
      src: '/colorful-wild-mushrooms-nature.webp',
      alt: 'Mushroom identification app — group of Amanita muscaria (fly agaric) mushrooms in autumn woodland',
      credit: 'Photo by Onderwijsgek · Wikimedia Commons · CC BY-SA 3.0 NL',
      height: 420,
    },
  },

  // ── 18. Web-based advantages ─────────────────────────────────────
  {
    block_type: 'heading',
    data: { title: 'Why This Mushroom Identifier Is Useful as a Web-Based Tool?', level: 'h2', align: 'center' },
  },
  {
    block_type: 'rich-text',
    data: {
      html: `<p>One advantage of a web-based mushroom identifier is accessibility. Unlike many mobile apps, the tool works directly in a browser on desktop, tablet, or smartphone. This makes it easy to use while hiking or exploring outdoor environments.</p>
<h3>Key advantages include:</h3>
<ul>
<li>✓ No app download or installation required</li>
<li>✓ Works on mobile devices and computers</li>
<li>✓ Fast access in the field</li>
<li>✓ No account creation necessary</li>
<li>✓ Unlimited identification requests</li>
</ul>
<p>Because it runs entirely online, users can identify multiple specimens during a single outing without needing to install updates or manage software.</p>`,
    },
  },

  // ── 19. ID Chart ──────────────────────────────────────────────────
  {
    block_type: 'heading',
    data: {
      title: 'Mushroom ID Chart: Common Types',
      subtitle: 'A mushroom ID chart is a helpful visual reference used in mushroom identification and mycology. It groups mushrooms by their key structural traits so beginners can quickly narrow down possible species.',
      level: 'h2',
      align: 'center',
    },
  },
  {
    block_type: 'rich-text',
    data: {
      html: `<table>
<thead><tr><th>Mushroom Type</th><th>Key Features</th><th>Habitat</th></tr></thead>
<tbody>
<tr><td><strong>Gilled Mushrooms</strong></td><td>Thin blade-like gills under the cap, visible stem</td><td>Forest soil, grasslands</td></tr>
<tr><td><strong>Pore Mushrooms (Boletes)</strong></td><td>Sponge-like underside with pores, thick caps</td><td>Near hardwood or conifer trees</td></tr>
<tr><td><strong>Tooth / Spine Mushrooms</strong></td><td>Underside covered with soft spines or teeth</td><td>Forest floors, moss, decaying wood</td></tr>
<tr><td><strong>Polypores / Shelf Fungi</strong></td><td>Bracket or shelf-shaped, no traditional stem</td><td>Dead logs, tree trunks</td></tr>
<tr><td><strong>Puffballs</strong></td><td>Round, no visible gills, release spores as powder</td><td>Grasslands, fields, forest edges</td></tr>
<tr><td><strong>Morels</strong></td><td>Honeycomb-pattern caps with hollow interior</td><td>Forest soil near trees</td></tr>
<tr><td><strong>Amanita Group</strong></td><td>Often have gills, a ring, and a volva at base</td><td>Forests with oak, birch, or conifer</td></tr>
</tbody></table>
<p style="text-align:center">When identifying boletes, note that most are safe but some can cause illness. Learn whether <a href="/are-there-any-deadly-leccinum-mushrooms">any Leccinum mushrooms are deadly</a> and how to distinguish edible species like <a href="/boletus-edulis">Boletus edulis (king bolete)</a> from bitter lookalikes.</p>`,
    },
  },

  // ── 20. Visual break — basket ─────────────────────────────────────
  {
    block_type: 'visual-break',
    data: {
      src: '/wild-mushroom-basket-foraging.webp',
      alt: 'Mushroom identification app — basket of freshly foraged Boletus edulis (king boletes / porcini)',
      credit: 'Photo by George Chernilevsky · Wikimedia Commons · Public Domain',
      height: 400,
    },
  },

  // ── 21. Key benefits ──────────────────────────────────────────────
  {
    block_type: 'heading',
    data: { title: 'Key Benefits of Using This Free Mushroom Identifier', level: 'h2', align: 'center' },
  },
  {
    block_type: 'feature-grid',
    data: {
      columns: 2,
      items: [
        { title: 'Free Access with No Hidden Fees', description: 'This mushroom identification tool is completely free to use. There are no subscription plans, locked features, or hidden charges. Anyone interested in fungi identification, mushroom foraging, or nature observation can access the tool instantly through a web browser.' },
        { title: 'Unlimited Mushroom Identifications', description: 'Users can run as many identification requests as they need. Each photo submission is analyzed independently by the AI recognition system, allowing you to identify multiple specimens during a single outing.' },
        { title: 'Simple and Easy Photo Upload Workflow', description: 'The tool is designed with a straightforward interface that allows users to upload images quickly. The image analysis system works best when photos show important mushroom structures such as cap shape, gills, stem, and habitat.' },
        { title: 'Fast Ranked Species Results', description: 'Once images are uploaded, the AI analyzes visual patterns and compares them with thousands of labeled fungal specimen images. The system returns a ranked list of possible mushroom species within seconds.' },
        { title: 'Helpful for Learning Mushroom Traits', description: 'Using a mushroom identifier is also a great way to learn about mushroom anatomy and fungal biology. As users explore different species, they become familiar with important identification traits.' },
      ],
    },
  },

  // ── 22. When to Consult Expert ────────────────────────────────────
  {
    block_type: 'heading',
    data: {
      title: 'When to Consult a Local Expert?',
      subtitle: 'There are times when expert assistance is essential. If a mushroom may pose a health risk, a trained professional should always confirm identification.',
      level: 'h2',
      align: 'center',
    },
  },
  {
    block_type: 'rich-text',
    data: {
      html: `<ul>
<li>🔬 <strong>When the species is unknown</strong> — Never guess with an unfamiliar find</li>
<li>⚠️ <strong>When toxicity is suspected</strong> — Seek immediate medical help if ingested</li>
<li>🌿 <strong>Before your first forage</strong> — Go with an experienced guide first</li>
<li>📍 <strong>For local regional species</strong> — Regional experts know local variations</li>
</ul>
<h3>Experts who can help include:</h3>
<ul>
<li>✓ Professional mycologists</li>
<li>✓ Members of a regional mycological society</li>
<li>✓ Local mushroom identification groups</li>
<li>✓ Poison control specialists</li>
</ul>`,
    },
  },

  // ── 23. Look-alikes heading ──────────────────────────────────────
  {
    block_type: 'heading',
    data: {
      title: 'Common Similar Species Our Mushroom Identifier Distinguishes',
      subtitle: 'Understanding look-alike mushrooms is essential in mushroom identification and mycology. Many fungal species share similar cap color or shape, but differ in gill attachment, stem structure, habitat, smell, and seasonality.',
      level: 'h2',
      align: 'center',
    },
  },

  // ── 23a. Death Cap vs Paddy Straw ────────────────────────────────
  {
    block_type: 'two-column',
    data: {
      imageSrc: '/death-cap-vs-paddy-straw-mushroom.webp',
      imageAlt: 'Death Cap vs Paddy Straw Mushroom comparison',
      html: `<h3>1. Death Cap vs Paddy Straw Mushroom</h3>
<p><em>(Amanita phalloides vs Volvariella volvacea)</em></p>
<p>The death cap is one of the most toxic mushrooms, often confused with the edible paddy straw mushroom due to similar appearance when young. The key difference lies in the presence of a ring and volva, along with habitat — forest vs cultivated environments.</p>
<p><strong>Our AI</strong> identifies differences in volva structure, ring presence, habitat context, and cap color variation to prevent confusion.</p>`,
    },
  },
  // ── 23b. Destroying Angel vs Button ───────────────────────────────
  {
    block_type: 'two-column',
    data: {
      imageSrc: '/destroying-angel-vs-button-mushroom.webp',
      imageAlt: 'Destroying Angel vs Button Mushroom comparison',
      reverse: true,
      html: `<h3>2. Destroying Angel vs Button Mushroom</h3>
<p><em>(Amanita bisporigera vs Agaricus bisporus)</em></p>
<p>The destroying angel looks very similar to edible button mushrooms, especially when young. However, it contains deadly toxins. The most reliable differences include gill color change and absence of volva in Agaricus.</p>
<p><strong>Our AI</strong> detects gill color progression, stem base structure, and habitat differences to distinguish these species.</p>`,
    },
  },
  // ── 23c. Chanterelle vs False Chanterelle ─────────────────────────
  {
    block_type: 'two-column',
    data: {
      imageSrc: '/chanterelle-vs-false-chanterelle.webp',
      imageAlt: 'Chanterelle vs False Chanterelle comparison',
      html: `<h3>3. Chanterelle vs False Chanterelle</h3>
<p><em>(<a href="/cantharellus-cibarius">Cantharellus cibarius</a> vs Hygrophoropsis aurantiaca)</em></p>
<p>True chanterelles are prized edible mushrooms but are often confused with false chanterelles. The key difference lies in ridge-like folds vs true gills, along with smell and growth environment.</p>
<p><strong>Our AI</strong> identifies ridge vs gill structures, color intensity, and substrate (soil vs wood) for accurate differentiation.</p>
<p>Another dangerous chanterelle look-alike is <a href="/omphalotus-illudens">Omphalotus illudens (Jack O'Lantern)</a>, which grows in clusters on wood and has true gills instead of ridges.</p>`,
    },
  },
  // ── 23d. Oyster vs Angel Wings ────────────────────────────────────
  {
    block_type: 'two-column',
    data: {
      imageSrc: '/oyster-mushroom-vs-angel-wings.webp',
      imageAlt: 'Oyster Mushroom vs Angel Wings comparison',
      reverse: true,
      html: `<h3>4. Oyster Mushroom vs Angel Wings</h3>
<p><em>(<a href="/pleurotus-ostreatus">Pleurotus ostreatus</a> vs Pleurocybella porrigens)</em></p>
<p>Both species grow in clusters on wood, making them visually similar. However, oyster mushrooms are edible, while angel wings can be toxic in some conditions. The main differences include thickness and substrate type.</p>
<p><strong>Our AI</strong> compares growth on hardwood vs conifer, gill attachment, and body thickness to separate these species.</p>`,
    },
  },
  // ── 23e. Morel vs False Morel ────────────────────────────────────
  {
    block_type: 'two-column',
    data: {
      imageSrc: '/morel-vs-false-morel.webp',
      imageAlt: 'Morel vs False Morel comparison',
      html: `<h3>5. Morel vs False Morel</h3>
<p><em>(<a href="/morchella-esculenta">Morchella esculenta</a> vs <a href="/gyromitra-esculenta">Gyromitra esculenta</a>)</em></p>
<p>Morels are highly valued edible mushrooms, but false morels can be toxic. The most important distinction is internal structure and cap shape.</p>
<p><strong>Our AI</strong> analyzes cap texture patterns, internal structure clues, and shape consistency for identification.</p>`,
    },
  },
  // ── 23f. Puffball vs Amanita ─────────────────────────────────────
  {
    block_type: 'two-column',
    data: {
      imageSrc: '/puffball-vs-young-amanita.webp',
      imageAlt: 'Puffball vs Young Amanita comparison',
      reverse: true,
      html: `<h3>6. Puffball vs Young Amanita</h3>
<p><em>(Lycoperdon spp. vs Amanita spp. immature)</em></p>
<p>Young Amanita mushrooms can resemble puffballs before their caps open. This is a critical distinction because Amanita species are often highly toxic.</p>
<p><strong>Our AI</strong> evaluates internal structure (via context clues), growth pattern, and base features to avoid misidentification. <a href="/scleroderma-citrinum">Scleroderma citrinum (common earthball)</a> is another round fungus sometimes confused with puffballs.</p>`,
    },
  },
  // ── 23g. King Bolete vs Bitter Bolete ─────────────────────────────
  {
    block_type: 'two-column',
    data: {
      imageSrc: '/king-bolete-vs-bitter-bolete.webp',
      imageAlt: 'King Bolete vs Bitter Bolete comparison',
      html: `<h3>7. King Bolete vs Bitter Bolete</h3>
<p><em>(<a href="/boletus-edulis">Boletus edulis</a> vs Tylopilus felleus)</em></p>
<p>Both are pore mushrooms and look very similar, but the bitter bolete is inedible due to taste. Differences include pore color and stem features.</p>
<p><strong>Our AI</strong> identifies pore color variations, stem patterns, and subtle surface differences to distinguish these boletes.</p>`,
    },
  },
  // ── 23h. Shaggy Ink vs Common Ink ─────────────────────────────────
  {
    block_type: 'two-column',
    data: {
      imageSrc: '/shaggy-ink-cap-vs-common-ink-cap.webp',
      imageAlt: 'Shaggy Ink Cap vs Common Ink Cap comparison',
      reverse: true,
      html: `<h3>8. Shaggy Ink Cap vs Common Ink Cap</h3>
<p><em>(Coprinus comatus vs Coprinopsis atramentaria)</em></p>
<p>Both ink caps grow in urban and grassy areas, but they differ in cap texture and appearance.</p>
<p><strong>Our AI</strong> analyzes cap texture, shape, and growth environment to clearly separate these similar species.</p>`,
    },
  },

  // ── 24. FAQ ──────────────────────────────────────────────────────
  {
    block_type: 'heading',
    data: { title: 'Frequently Asked Questions', level: 'h2', align: 'center' },
  },
  {
    block_type: 'rich-text',
    data: {
      html: `<h3>What type of mushroom is this?</h3>
<p>To determine what type of mushroom this is, observe key features such as cap shape, gills or pores, stem structure, and habitat. A mushroom identifier uses AI to analyze these traits and compare them with a database of fungal species.</p>
<h3>How does a mushroom identifier work?</h3>
<p>A mushroom identifier uses artificial intelligence and computer vision to analyze uploaded photos of a mushroom's cap, gills, pores, stem, and base. The system compares these visual features with thousands of labeled specimens and returns a ranked list of possible species matches.</p>
<h3>Is there a free mushroom identifier app?</h3>
<p>Yes, this tool works as a free web-based mushroom identifier that runs directly in your browser. Upload images and use AI mushroom recognition without installing software.</p>
<h3>Can a wild mushroom be identified from a picture?</h3>
<p>Yes, a wild mushroom identifier by picture can recognize many species by analyzing structural traits like cap texture, gill pattern, and habitat. However, photo-based identification should always be confirmed with a field guide or mycologist.</p>
<h3>Can a mushroom identifier tell if a mushroom is edible?</h3>
<p>No. A mushroom identifier tool can suggest possible species but cannot confirm edibility or toxicity. Some dangerous mushrooms like Amanita phalloides (death cap) closely resemble edible species.</p>
<h3>Why does habitat matter in mushroom identification?</h3>
<p>Many fungi grow in specific environments such as forest soil, moss, hardwood logs, or conifer wood. Habitat information helps narrow down possible mushroom species since many fungi form ecological relationships with certain trees or substrates.</p>
<h3>Do I need to create an account?</h3>
<p>No. The tool works instantly in your browser and does not require registration or sign-up.</p>
<h3>How does the AI identify mushrooms?</h3>
<p>The system uses machine learning and computer vision trained on large datasets of labeled fungal specimen images. It analyzes features such as cap shape, gill pattern, stem structure, and habitat clues.</p>`,
    },
  },

  // ── 25. Final safety reminder ─────────────────────────────────────
  {
    block_type: 'cta-box',
    data: {
      variant: 'accent',
      heading: 'Final Safety Reminder Before Using Any Mushroom Identification Result',
      text: 'A mushroom identifier is a valuable educational tool, but it cannot replace professional expertise or traditional identification methods. Never eat a wild mushroom based solely on AI identification. Keep unknown mushrooms away from children and pets. Always verify results using field guides or expert advice. Treat AI suggestions as hypotheses, not final answers. Nature contains an incredible diversity of fungi — using a mushroom identifier responsibly can help you explore this fascinating world while staying safe and informed.',
    },
  },
]
