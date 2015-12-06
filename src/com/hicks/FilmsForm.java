package com.hicks;

public class FilmsForm
{
    private String minimumVotesParam;
    private String titleParam;
    private String ratingParam;
    private String fromReleaseDate;
    private String toReleaseDate;
    private String language;
    private String genre;

    public FilmsForm(String minimumVotesParam, String titleParam, String ratingParam, String fromReleaseDate, String toReleaseDate, String language, String genre)
    {
        this.minimumVotesParam = minimumVotesParam;
        this.titleParam = titleParam;
        this.ratingParam = ratingParam;
        this.fromReleaseDate = fromReleaseDate;
        this.toReleaseDate = toReleaseDate;
        this.language = language;
        this.genre = genre;
    }


    // Getter / Setter
    public String getMinimumVotesParam()
    {
        return minimumVotesParam;
    }

    public void setMinimumVotesParam(String minimumVotesParam)
    {
        this.minimumVotesParam = minimumVotesParam;
    }

    public String getTitleParam()
    {
        return titleParam;
    }

    public void setTitleParam(String titleParam)
    {
        this.titleParam = titleParam;
    }

    public String getRatingParam()
    {
        return ratingParam;
    }

    public void setRatingParam(String ratingParam)
    {
        this.ratingParam = ratingParam;
    }

    public String getFromReleaseDate()
    {
        return fromReleaseDate;
    }

    public void setFromReleaseDate(String fromReleaseDate)
    {
        this.fromReleaseDate = fromReleaseDate;
    }

    public String getToReleaseDate()
    {
        return toReleaseDate;
    }

    public void setToReleaseDate(String toReleaseDate)
    {
        this.toReleaseDate = toReleaseDate;
    }

    public String getLanguage()
    {
        return language;
    }

    public void setLanguage(String language)
    {
        this.language = language;
    }

    public String getGenre()
    {
        return genre;
    }

    public void setGenre(String genre)
    {
        this.genre = genre;
    }
}