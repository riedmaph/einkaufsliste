package rewecrawler;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class REWECrawler {
	private final static int itemsperpage=250;
	public static void main(String[] args) throws IOException {
		PrintWriter writer = new PrintWriter(new FileOutputStream("articles.csv", false));
		AtomicInteger id = new AtomicInteger(82000000);
		for (int i = 1, limit=109; i<=limit;++i) {
			File  f = new File("vendor/rewe"+i+".html");
			Document doc = Jsoup.parse(f, "UTF8");
			Elements articles = doc.select(".rs-js-product-item");
			if (articles.size()!=itemsperpage) {
				System.err.println("On page: "+i+" only "+articles.size()+" article");
			}
			final int j = i;
			String result = articles.parallelStream().map(e->ProductItem(e.clone(),j,id)).collect(Collectors.joining(""));
			writer.print(result);		
		} 
		writer.close();
	}
	static String ProductItem(Element itemDom,int i,AtomicInteger id){
		Elements detailLinks = itemDom.select("a.rs-qa-product-details-link.rs-js-key-navigation");
		if (detailLinks.size()!=1) {
			System.err.println("On page: "+i+" only "+detailLinks.size()+" detail links");
		}
		if (detailLinks.size()<1) {
			return "ERROR";
		}
		String link = detailLinks.get(0).attr("href");
		String firstCategory=link.split("/")[3];
		String secondCategory=link.split("/")[4];
		String linkDescription=link.split("/")[5];
		
		Elements titles = itemDom.select("a.rs-producttile__title");
		if (titles.size()!=1) {
			System.err.println("On page: "+i+" only "+titles.size()+" title");
		}
		if (titles.size()<1) {
			return "ERROR";
		}
		String title=titles.get(0).html();
		Elements descrs = itemDom.select("mark.rs-qa-price-base");
		if (descrs.size()!=1) {
			System.err.println("On page: "+i+" only "+descrs.size()+" description");
		}
		if (descrs.size()<1) {
			return "ERROR";
		}
		String description = descrs.get(0).html();
		Elements prDecs = itemDom.select("span.rs-price__predecimal");
		if (prDecs.size()!=1) {
			System.err.println("On page: "+i+" only "+prDecs.size()+" price decimal");
		}
		if (prDecs.size()<1) {
			return "ERROR";
		}
		String price= prDecs.get(0).html()+".";
		Elements decs = itemDom.select("span.rs-price__decimal");
		if (decs.size()!=1) {
			System.err.println("On page: "+i+" only "+decs.size()+" price decimal");
		}
		if (decs.size()<1) {
			return "ERROR";
		}
		price+= decs.get(0).html();
		int id2=id.incrementAndGet();
		String ret = "";
		ret += buildCSVLine(id2,title,"Article",title,"https://shop.rewe.de/productList?search=&sorting=RELEVANCE&startPage="+i+"&selectedFacets=");
		ret += buildCSVLine(id2,title,"Category",firstCategory,"https://shop.rewe.de/productList?search=&sorting=RELEVANCE&startPage="+i+"&selectedFacets=");
		ret += buildCSVLine(id2,title,"Category2",secondCategory,"https://shop.rewe.de/productList?search=&sorting=RELEVANCE&startPage="+i+"&selectedFacets=");
		ret += buildCSVLine(id2,title,"Linktitle",linkDescription,"https://shop.rewe.de/productList?search=&sorting=RELEVANCE&startPage="+i+"&selectedFacets=");
		ret += buildCSVLine(id2,title,"Description",description,"https://shop.rewe.de/productList?search=&sorting=RELEVANCE&startPage="+i+"&selectedFacets=");		
		ret += buildCSVLine(id2,title,"Price",price,"https://shop.rewe.de/productList?search=&sorting=RELEVANCE&startPage="+i+"&selectedFacets=");
		return ret;
	}
	
	static String buildCSVLine(int id2,String title,String tag,String value,String from) {
		return	id2+";"+"\""+title+"\""+";"+"\""+tag+"\""+";"+"\""+value+"\""+";"+"\""+from+"\""+"\n";
	}
}
